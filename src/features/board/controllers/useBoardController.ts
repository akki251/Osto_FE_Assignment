import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moveTask, createTask, updateTask, getBoard, getBoards, deleteTask, getActivity, getPublicBoard } from '../use-cases';
import type { AppError } from '../../../shared/errors/AppError';
import type { CreateTaskRequest, PatchTaskRequest, Board, Task, ActivityItem } from '../../../domain/entities';
import { QUERY_KEYS, invalidateAllQueries } from '../../../shared/utils/queryKeys';

export type BoardData = Board & { tasks: Record<string, Task> };

export function useBoardController(boardId?: string) {
  const qc = useQueryClient();

  const boardQuery = useQuery<BoardData>({
    queryKey: [QUERY_KEYS.BOARD, boardId],
    queryFn: () => getBoard(boardId!),
    enabled: !!boardId,
    staleTime: 5000,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });


  const createTaskMutation = useMutation<Task, AppError, CreateTaskRequest>({
    mutationFn: (req: CreateTaskRequest) => createTask(req),
    onSuccess: (task) => {
      invalidateAllQueries(qc, [[QUERY_KEYS.BOARD, task.boardId], [QUERY_KEYS.ACTIVITY, task.boardId]]);
    },
    onError: (err) => {
      console.error('Validation/Creation Error:', err.details || err.message);
      // In a real app, send to toast store here
    }
  });

  const patchTaskMutation = useMutation<Task, AppError, { taskId: string; patch: PatchTaskRequest }, { snapshots: any[] }>({
    mutationFn: ({ taskId, patch }) => updateTask(taskId, patch),
    onMutate: async ({ taskId, patch }) => {
      // Optimistic upate pattern
      const boardKeys = qc.getQueriesData<BoardData>({ queryKey: [QUERY_KEYS.BOARD] });
      const snapshots: { key: unknown[]; data: BoardData }[] = [];

      for (const [key, data] of boardKeys) {
        if (!data) continue;
        snapshots.push({ key: key as unknown[], data: JSON.parse(JSON.stringify(data)) });

        const task = data.tasks[taskId];
        if (!task) continue;

        const updated = { ...task, ...patch, updatedAt: new Date().toISOString() };

        if (patch.columnId && patch.columnId !== task.columnId) {
          const oldCol = data.columns.find(c => c.id === task.columnId);
          const newCol = data.columns.find(c => c.id === patch.columnId);
          if (oldCol) oldCol.taskIds = oldCol.taskIds.filter(id => id !== taskId);
          if (newCol && !newCol.taskIds.includes(taskId)) {
            if (patch.position !== undefined) {
              const insertIdx = newCol.taskIds.findIndex(tid => {
                const t = data.tasks[tid];
                return t && t.position > patch.position!;
              });
              if (insertIdx === -1) newCol.taskIds.push(taskId);
              else newCol.taskIds.splice(insertIdx, 0, taskId);
            } else {
              newCol.taskIds.push(taskId);
            }
          }
          updated.columnId = patch.columnId;
        } else if (patch.position !== undefined) {
          const col = data.columns.find(c => c.id === task.columnId);
          if (col) {
            col.taskIds = col.taskIds.filter(id => id !== taskId);
            const insertIdx = col.taskIds.findIndex(tid => {
              const t = data.tasks[tid];
              return t && t.position > patch.position!;
            });
            if (insertIdx === -1) col.taskIds.push(taskId);
            else col.taskIds.splice(insertIdx, 0, taskId);
          }
        }

        data.tasks[taskId] = updated;
        qc.setQueryData(key, { ...data });
      }

      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.snapshots) {
        for (const snap of ctx.snapshots) {
          qc.setQueryData(snap.key, snap.data);
        }
      }
    },
    onSettled: () => {
      invalidateAllQueries(qc, [[QUERY_KEYS.BOARD], [QUERY_KEYS.ACTIVITY]]);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      invalidateAllQueries(qc, [[QUERY_KEYS.BOARD], [QUERY_KEYS.ACTIVITY]]);
    },
  });

  // UCCR Orchestration specifically wrapping complex UI use cases
  const handleTaskDrop = async (
    taskId: string, 
    destColumnId: string, 
    destTasks: Task[], 
    overTaskId: string | null
  ) => {
    // The Controller delegates to the generic Mutation (which optimistically updates UI)
    // but relies on the UseCase to perform the strict business calculations.
    
    // 1. Calculate future state using pure generic UseCase logic
    moveTask(taskId, destColumnId, destTasks, overTaskId)
      .then(() => {
         // The repo was mutated by the use case, but our local UI mutation needs to trigger
         // optimistic rollouts. Here we could manually set UI state, or just let TanStack refetch.
         invalidateAllQueries(qc, [[QUERY_KEYS.BOARD], [QUERY_KEYS.ACTIVITY]]);
      });

    // We can ALSO fire the optimistic Tanstack mutation manually to trick UI temporarily
    // To preserve optimistic UI, we trigger patchTaskMutation
  };

  return {
    board: boardQuery.data,
    isLoading: boardQuery.isLoading,
    isError: boardQuery.isError,
    

    createTask: createTaskMutation.mutate,
    updateTask: patchTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    
    handleTaskDrop,
  };
}

export function useBoardsController(workspaceId: string | null) {
  const boardsQuery = useQuery({
    queryKey: [QUERY_KEYS.BOARDS, workspaceId],
    queryFn: () => getBoards(workspaceId!),
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });

  return {
    boards: boardsQuery.data,
    isLoading: boardsQuery.isLoading,
  };
}

export function useActivityController(boardId?: string) {
  const activityQuery = useQuery<ActivityItem[]>({
    queryKey: [QUERY_KEYS.ACTIVITY, boardId],
    queryFn: () => getActivity(),
    staleTime: 5000,
    refetchInterval: 8000,
  });

  return {
    activities: activityQuery.data,
    isLoading: activityQuery.isLoading,
  };
}

export function usePublicBoardController(shareToken?: string) {
  const publicBoardQuery = useQuery<BoardData>({
    queryKey: [QUERY_KEYS.PUBLIC_BOARD, shareToken],
    queryFn: () => getPublicBoard(shareToken!),
    enabled: !!shareToken,
    staleTime: 30000,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  return {
    board: publicBoardQuery.data,
    isLoading: publicBoardQuery.isLoading,
    isError: publicBoardQuery.isError,
  };
}

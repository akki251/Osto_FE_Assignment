import type { 
  BoardSummary, Board, Task, CreateTaskRequest, PatchTaskRequest, ActivityItem 
} from '../../../domain/entities';
import type { IBoardRepository } from './IBoardRepository';
import { TaskSchema } from '../../../shared/schemas';
import { MOCK_USERS, boardsStore, tasksStore, activityStore, persistStores } from '../../../shared/api/mockData';
import { v4 as uuid } from 'uuid';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms + Math.random() * 200));

let pollCount = 0;

export class BoardRepositoryImpl implements IBoardRepository {
  
  async getBoards(workspaceId: string): Promise<BoardSummary[]> {
    await delay();
    return boardsStore
      .filter(b => b.workspaceId === workspaceId)
      .map(b => ({
        id: b.id,
        title: b.title,
        description: b.description,
        columnCount: b.columns.length,
        taskCount: b.columns.reduce((acc, col) => acc + col.taskIds.length, 0),
        updatedAt: b.updatedAt,
      }));
  }

  async getBoard(boardId: string): Promise<Board & { tasks: Record<string, Task> }> {
    await delay(300);
    const board = boardsStore.find(b => b.id === boardId);
    if (!board) throw new Error('Board not found');
    const tasks: Record<string, Task> = {};
    board.columns.forEach(col => {
      col.taskIds.forEach(tid => {
        if (tasksStore[tid]) tasks[tid] = TaskSchema.parse(tasksStore[tid]);
      });
    });
    return { ...board, tasks };
  }

  async getPublicBoard(shareToken: string): Promise<Board & { tasks: Record<string, Task> }> {
    await delay(300);
    const board = boardsStore.find(b => b.shareToken === shareToken);
    if (!board) throw new Error('Public board not found');
    const tasks: Record<string, Task> = {};
    board.columns.forEach(col => {
      col.taskIds.forEach(tid => {
        if (tasksStore[tid]) tasks[tid] = TaskSchema.parse(tasksStore[tid]);
      });
    });
    return { ...board, tasks };
  }

  async createTask(req: CreateTaskRequest): Promise<Task> {
    await delay(300);
    const board = boardsStore.find(b => b.id === req.boardId);
    if (!board) throw new Error('Board not found');
    const col = board.columns.find(c => c.id === req.columnId);
    if (!col) throw new Error('Column not found');

    const maxPos = col.taskIds.reduce((max, tid) => {
      const t = tasksStore[tid];
      return t ? Math.max(max, t.position) : max;
    }, 0);

    const task: Task = {
      id: uuid(),
      boardId: req.boardId,
      columnId: req.columnId,
      title: req.title,
      description: req.description || '',
      priority: req.priority || 'MEDIUM',
      assignee: MOCK_USERS[0],
      dueDate: req.dueDate || null,
      tags: req.tags || [],
      position: maxPos + 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasksStore[task.id] = task;
    col.taskIds.push(task.id);
    board.updatedAt = new Date().toISOString();

    activityStore.unshift({
      id: uuid(),
      type: 'task_created',
      taskTitle: task.title,
      timestamp: new Date().toISOString(),
      user: MOCK_USERS[0].name,
    });

    persistStores();

    return task;
  }

  async patchTask(taskId: string, patch: PatchTaskRequest): Promise<Task> {
    await delay(200);
    const task = tasksStore[taskId];
    if (!task) throw new Error('Task not found');

    const oldColumnId = task.columnId;

    if (patch.title !== undefined) task.title = patch.title;
    if (patch.description !== undefined) task.description = patch.description;
    if (patch.priority !== undefined) task.priority = patch.priority;
    if (patch.dueDate !== undefined) task.dueDate = patch.dueDate;
    if (patch.tags !== undefined) task.tags = patch.tags;
    if (patch.position !== undefined) task.position = patch.position;
    task.updatedAt = new Date().toISOString();

    if (patch.columnId !== undefined && patch.columnId !== oldColumnId) {
      const board = boardsStore.find(b => b.id === task.boardId);
      if (board) {
        const oldCol = board.columns.find(c => c.id === oldColumnId);
        const newCol = board.columns.find(c => c.id === patch.columnId);
        if (oldCol) oldCol.taskIds = oldCol.taskIds.filter(id => id !== taskId);
        if (newCol) newCol.taskIds.push(taskId);
        task.columnId = patch.columnId;
        board.updatedAt = new Date().toISOString();

        activityStore.unshift({
          id: uuid(),
          type: 'task_moved',
          taskTitle: task.title,
          from: oldCol?.title,
          to: newCol?.title,
          timestamp: new Date().toISOString(),
          user: MOCK_USERS[0].name,
        });
      }
    } else {
      activityStore.unshift({
        id: uuid(),
        type: 'task_updated',
        taskTitle: task.title,
        timestamp: new Date().toISOString(),
        user: MOCK_USERS[0].name,
      });
    }

    persistStores();

    return { ...task };
  }

  async deleteTask(taskId: string): Promise<void> {
    await delay(200);
    const task = tasksStore[taskId];
    if (!task) throw new Error('Task not found');
    const board = boardsStore.find(b => b.id === task.boardId);
    if (board) {
      const col = board.columns.find(c => c.id === task.columnId);
      if (col) col.taskIds = col.taskIds.filter(id => id !== taskId);
      board.updatedAt = new Date().toISOString();
    }
    delete tasksStore[taskId];
    persistStores();
  }

  async getActivity(): Promise<ActivityItem[]> {
    await delay(200);
    return activityStore.slice(0, 20);
  }

  async pollBoardUpdates(boardId: string): Promise<{ hasChanges: boolean; board?: Board & { tasks: Record<string, Task> } }> {
    await delay(100);
    pollCount++;
    if (pollCount % 5 === 0) {
      const board = boardsStore.find(b => b.id === boardId);
      if (board && board.columns.length > 1) {
        const srcCol = board.columns.find(c => c.taskIds.length > 1);
        if (srcCol) {
          const taskId = srcCol.taskIds[0];
          const task = tasksStore[taskId];
          if (task) {
            activityStore.unshift({
              id: uuid(),
              type: 'task_updated',
              taskTitle: task.title,
              timestamp: new Date().toISOString(),
              user: MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)].name,
            });
            board.updatedAt = new Date().toISOString();
            persistStores();
          }
        }
      }
    }
    const board = boardsStore.find(b => b.id === boardId);
    if (!board) return { hasChanges: false };
    const tasks: Record<string, Task> = {};
    board.columns.forEach(col => {
      col.taskIds.forEach(tid => {
        if (tasksStore[tid]) tasks[tid] = TaskSchema.parse(tasksStore[tid]);
      });
    });
    return { hasChanges: true, board: { ...board, tasks } };
  }
}

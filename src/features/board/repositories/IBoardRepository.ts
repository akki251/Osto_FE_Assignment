import type { 
  BoardSummary, Board, Task, CreateTaskRequest, PatchTaskRequest, ActivityItem 
} from '../../../domain/entities';

export interface IBoardRepository {
  getBoards(workspaceId: string): Promise<BoardSummary[]>;
  getBoard(boardId: string): Promise<Board & { tasks: Record<string, Task> }>;
  getPublicBoard(shareToken: string): Promise<Board & { tasks: Record<string, Task> }>;
  createTask(req: CreateTaskRequest): Promise<Task>;
  patchTask(taskId: string, patch: PatchTaskRequest): Promise<Task>;
  deleteTask(taskId: string): Promise<void>;
  getActivity(): Promise<ActivityItem[]>;
  pollBoardUpdates(boardId: string): Promise<{ hasChanges: boolean; board?: Board & { tasks: Record<string, Task> } }>;
}

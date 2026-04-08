import type { IBoardRepository } from '../repositories/IBoardRepository';
import type { BoardSummary, ActivityItem } from '../../../domain/entities';

export const getBoardsUseCase = (repo: IBoardRepository) => {
  return async (workspaceId: string): Promise<BoardSummary[]> => {
    return repo.getBoards(workspaceId);
  };
};

export const getBoardUseCase = (repo: IBoardRepository) => {
  return async (boardId: string) => {
    return repo.getBoard(boardId);
  };
};

export const deleteTaskUseCase = (repo: IBoardRepository) => {
  return async (taskId: string): Promise<void> => {
    return repo.deleteTask(taskId);
  };
};

export const getActivityUseCase = (repo: IBoardRepository) => {
  return async (): Promise<ActivityItem[]> => {
    return repo.getActivity();
  };
};

export const getPublicBoardUseCase = (repo: IBoardRepository) => {
  return async (shareToken: string) => {
    return repo.getPublicBoard(shareToken);
  };
};

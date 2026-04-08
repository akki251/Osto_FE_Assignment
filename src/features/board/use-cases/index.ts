import { BoardRepositoryImpl } from '../repositories/BoardRepositoryImpl';
import { moveTaskUseCase } from './MoveTaskUseCase';
import { createTaskUseCase, updateTaskWithValidation } from './TaskUseCases';
import { getBoardsUseCase, getBoardUseCase, deleteTaskUseCase, getActivityUseCase, getPublicBoardUseCase } from './BoardUseCases';

// Single shared repository instance
const boardRepo = new BoardRepositoryImpl();

// Export exclusively bounded use case shells
export const moveTask = moveTaskUseCase(boardRepo);
export const createTask = createTaskUseCase(boardRepo);
export const updateTask = updateTaskWithValidation(boardRepo);
export const getBoard = getBoardUseCase(boardRepo);
export const getBoards = getBoardsUseCase(boardRepo);
export const deleteTask = deleteTaskUseCase(boardRepo);
export const getActivity = getActivityUseCase(boardRepo);
export const getPublicBoard = getPublicBoardUseCase(boardRepo);

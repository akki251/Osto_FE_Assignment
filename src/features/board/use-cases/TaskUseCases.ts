import type { IBoardRepository } from '../repositories/IBoardRepository';
import { CreateTaskRequestSchema, PatchTaskRequestSchema } from '../../../shared/schemas';
import { mapZodErrorToAppError } from '../../../shared/errors/AppError';
import type { Task, CreateTaskRequest, PatchTaskRequest } from '../../../domain/entities';

export const createTaskUseCase = (repo: IBoardRepository) => {
  return async (payload: CreateTaskRequest): Promise<Task> => {
    const result = CreateTaskRequestSchema.safeParse(payload);
    
    if (!result.success) {
      throw mapZodErrorToAppError(result.error);
    }
    
    // Proceed if valid
    return repo.createTask(result.data as CreateTaskRequest);
  };
};

export const updateTaskWithValidation = (repo: IBoardRepository) => {
  return async (taskId: string, patch: PatchTaskRequest): Promise<Task> => {
    const result = PatchTaskRequestSchema.safeParse(patch);
    
    if (!result.success) {
      throw mapZodErrorToAppError(result.error);
    }
    
    // Proceed if valid
    return repo.patchTask(taskId, result.data as PatchTaskRequest);
  };
};

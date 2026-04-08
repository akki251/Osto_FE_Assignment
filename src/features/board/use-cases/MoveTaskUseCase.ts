import type { IBoardRepository } from '../repositories/IBoardRepository';
import type { Task } from '../../../domain/entities';

/**
 * Executes a move action, encapsulating fractional indexing logic.
 * Assumes destTasks are already sorted by position.
 */
export const moveTaskUseCase = (repository: IBoardRepository) => {
  return async (
    taskId: string,
    destColumnId: string,
    destTasks: Task[],
    overTaskId: string | null
  ): Promise<Task> => {
    let newPosition: number;

    if (overTaskId) {
      // We hovered over a specific task
      const overIdx = destTasks.findIndex((t) => t.id === overTaskId);
      if (overIdx === -1) throw new Error("Target task not found in destination column");

      const overTask = destTasks[overIdx];
      const before = overIdx > 0 ? destTasks[overIdx - 1]?.position ?? 0 : 0;
      const after = overTask.position;
      newPosition = (before + after) / 2;
    } else {
      // Dropped on an empty column or at the end
      const lastPos = destTasks.length > 0 ? destTasks[destTasks.length - 1].position : 0;
      newPosition = lastPos + 1000;
    }

    return await repository.patchTask(taskId, {
      columnId: destColumnId,
      position: newPosition,
    });
  };
};

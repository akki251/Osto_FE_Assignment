import type { IWorkspaceRepository } from '../repositories/IWorkspaceRepository';
import type { Workspace } from '../../../domain/entities';

export const getWorkspacesUseCase = (repo: IWorkspaceRepository) => {
  return async (): Promise<Workspace[]> => {
    return repo.getWorkspaces();
  };
};

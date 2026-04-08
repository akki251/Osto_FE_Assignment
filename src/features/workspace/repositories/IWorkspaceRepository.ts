import type { Workspace } from '../../../domain/entities';

export interface IWorkspaceRepository {
  getWorkspaces(): Promise<Workspace[]>;
}

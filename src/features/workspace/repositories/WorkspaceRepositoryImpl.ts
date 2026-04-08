import type { Workspace } from '../../../domain/entities';
import type { IWorkspaceRepository } from './IWorkspaceRepository';
import { MOCK_WORKSPACES } from '../../../shared/api/mockData';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms + Math.random() * 200));

export class WorkspaceRepositoryImpl implements IWorkspaceRepository {
  async getWorkspaces(): Promise<Workspace[]> {
    await delay();
    return MOCK_WORKSPACES;
  }
}

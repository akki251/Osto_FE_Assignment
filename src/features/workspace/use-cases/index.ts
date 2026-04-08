import { WorkspaceRepositoryImpl } from '../repositories/WorkspaceRepositoryImpl';
import { getWorkspacesUseCase } from './WorkspaceUseCases';

// Single shared repository instance
const workspaceRepo = new WorkspaceRepositoryImpl();

// Export exclusively bounded use case shells
export const getWorkspaces = getWorkspacesUseCase(workspaceRepo);

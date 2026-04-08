import { useQuery } from '@tanstack/react-query';
import type { Workspace } from '../../../domain/entities';
import { QUERY_KEYS } from '../../../shared/utils/queryKeys';
import { getWorkspaces } from '../use-cases';

export function useWorkspaceController() {
  const { data, isLoading, isError } = useQuery<Workspace[]>({
    queryKey: [QUERY_KEYS.WORKSPACES],
    queryFn: () => getWorkspaces(),
    staleTime: 5 * 60 * 1000,
  });

  return { workspaces: data, isLoading, isError };
}

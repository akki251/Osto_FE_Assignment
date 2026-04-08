import { QueryClient } from '@tanstack/react-query';

export const QUERY_KEYS = {
  WORKSPACES: 'workspaces',
  BOARDS: 'boards', // Typically ['boards', workspaceId]
  BOARD: 'board',   // Typically ['board', boardId]
  ACTIVITY: 'activity', // Typically ['activity']
  PUBLIC_BOARD: 'public-board', // Typically ['public-board', shareToken]
} as const;

/**
 * Utility to invalidate multiple query keys at once.
 * Loop through and invalidate each query key passed in.
 */
export function invalidateAllQueries(queryClient: QueryClient, keys: (string | readonly unknown[])[]) {
  keys.forEach((key) => {
    const queryKey = Array.isArray(key) ? key : [key];
    queryClient.invalidateQueries({ queryKey });
  });
}

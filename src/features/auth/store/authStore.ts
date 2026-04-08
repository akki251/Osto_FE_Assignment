import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../../../domain/entities';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setLoading: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      status: 'idle',
      setAuth: (user, accessToken) =>
        set({ user, accessToken, status: 'authenticated' }),
      logout: () =>
        set({ user: null, accessToken: null, status: 'unauthenticated' }),
      setLoading: () => set({ status: 'loading' }),
    }),
    {
      name: 'taskboard-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        status: state.status === 'authenticated' ? 'authenticated' : 'unauthenticated',
      }),
    }
  )
);

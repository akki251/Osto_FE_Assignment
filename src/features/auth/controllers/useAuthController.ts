import { useState } from 'react';
import { login } from '../use-cases';
import { useAuthStore } from '../store/authStore';

export function useAuthController() {
  const [error, setError] = useState<string>('');
  const { setAuth, setLoading, status } = useAuthStore();

  const handleLogin = async (email: string, pass: string) => {
    setLoading();
    setError('');
    try {
      const response = await login({ email, password: pass });
      // Controller maps the User + Token directly into our Global UI state
      setAuth(response.user, response.accessToken);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return {
    handleLogin,
    error,
    isLoading: status === 'loading',
  };
}

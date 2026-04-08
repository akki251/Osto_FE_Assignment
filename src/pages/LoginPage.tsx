import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthController } from '../features/auth/controllers/useAuthController';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@demo.com');
  const [password, setPassword] = useState('demo');
  const navigate = useNavigate();
  const { handleLogin, isLoading, error } = useAuthController();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
    // If login succeeds, the ProtectedRoute handles redirect automatically
    navigate('/auth-check'); // triggers route recalculation
  };

  return (
    <div className="login-page">
      <div className="auth-box">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your workspaces</p>
        <form onSubmit={onSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <div className="form-group">
            <label className="form-group__label" htmlFor="email">Email</label>
            <input
              id="email"
              className="form-group__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-group__label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-group__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="login-card__hint">
          Use <strong>demo@demo.com / demo</strong> or any credentials
        </p>
      </div>
    </div>
  );
}

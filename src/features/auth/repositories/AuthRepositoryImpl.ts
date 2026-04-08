import type { LoginRequest, LoginResponse } from '../../../domain/entities';
import type { IAuthRepository } from './IAuthRepository';
import { MOCK_USERS } from '../../../shared/api/mockData';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms + Math.random() * 200));

export class AuthRepositoryImpl implements IAuthRepository {
  async login(req: LoginRequest): Promise<LoginResponse> {
    await delay(600);
    if (req.email === 'demo@demo.com' && req.password === 'demo') {
      return { user: MOCK_USERS[0], accessToken: 'mock-jwt-token-' + Date.now() };
    }
    // Accept any email/password for convenience
    return {
      user: { ...MOCK_USERS[0], email: req.email, name: req.email.split('@')[0] },
      accessToken: 'mock-jwt-token-' + Date.now(),
    };
  }
}

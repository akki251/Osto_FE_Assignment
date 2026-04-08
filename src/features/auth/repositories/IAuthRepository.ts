import type { LoginRequest, LoginResponse } from '../../../domain/entities';

export interface IAuthRepository {
  login(req: LoginRequest): Promise<LoginResponse>;
}

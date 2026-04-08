import type { IAuthRepository } from '../repositories/IAuthRepository';
import type { LoginRequest, LoginResponse } from '../../../domain/entities';

export const loginUseCase = (repository: IAuthRepository) => {
  return async (credential: LoginRequest): Promise<LoginResponse> => {
    if (!credential.email.includes('@')) {
      throw new Error("Invalid email format");
    }
    
    // Abstracted away API implementation
    const response = await repository.login(credential);
    return response;
  };
};

import { AuthRepositoryImpl } from '../repositories/AuthRepositoryImpl';
import { loginUseCase } from './LoginUseCase';

// Single shared repository instance
const authRepo = new AuthRepositoryImpl();

// Export exclusively bounded use case shells
export const login = loginUseCase(authRepo);

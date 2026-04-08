import { ZodError } from 'zod';

export type ErrorCode = 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR' | 'UNAUTHORIZED';

export interface ErrorDetail {
  field: string;
  message: string;
}

export class AppError extends Error {
  public code: ErrorCode;
  public status: number;
  public details?: ErrorDetail[];

  constructor(message: string, code: ErrorCode = 'INTERNAL_ERROR', status = 500, details?: ErrorDetail[]) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    
    // Set the prototype explicitly for extending built-ins (required in older TS targets, good practice)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Transforms a ZodError into a standard AppError mapping field paths to friendly messages.
 */
export function mapZodErrorToAppError(error: ZodError<any>): AppError {
  const details = error.issues.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));
  
  return new AppError(
    'Validation failed. Please check your inputs.',
    'VALIDATION_ERROR',
    400,
    details
  );
}

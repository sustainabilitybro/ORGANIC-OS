// Error handling utilities

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export function handleApiError(error: unknown): Response {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return new Response(JSON.stringify({
      error: error.message,
      code: error.code
    }), {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

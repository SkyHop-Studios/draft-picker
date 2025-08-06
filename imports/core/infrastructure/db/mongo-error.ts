export interface MongoServerError extends Error {
  readonly index: number
  readonly code: number
  readonly keyPattern: {
    [key: string]: number
  }
  readonly keyValue: {
    [key: string]: any
  }
}

export function isMongoServerError(error: unknown): error is MongoServerError {
  return error instanceof Error && "index" in error && "code" in error && "keyPattern" in error && "keyValue" in error;
}

export function isDuplicateKeyError(error: unknown): error is MongoServerError {
  return isMongoServerError(error) && error.code === 11000;
}

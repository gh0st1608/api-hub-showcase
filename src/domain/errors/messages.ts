export enum DomainErrorMessages {
  SAMPLE_NOT_FOUND = 'Sample not found',
  PROJECT_NOT_FOUND = 'Project not found',
  INVALID_PAYLOAD = 'Invalid payload',
}

export enum InfrastructureErrorMessages {
  DATABASE_CONNECTION_FAILED = 'Database connection failed',
  SAVE_FAILED = 'Save operation failed',
  QUERY_FAILED = 'Query execution failed',
}

export enum DomainSuccessMessages {
  GET_SAMPLE_SUCCESS = 'Sample retrieved successfully',
  CREATE_SAMPLE_SUCCESS = 'Sample created successfully',
}

export enum SecurityErrorMessages {
  UNAUTHENTICATED = 'Authentication required',
  INVALID_TOKEN = 'The provided token is invalid',
  TOKEN_EXPIRED = 'The provided token has expired',
  INSUFFICIENT_SCOPE = 'Insufficient scope to access this resource',
  INSUFFICIENT_ROLE = 'Insufficient role to access this resource',
  FORBIDDEN_BY_POLICY = 'Access denied by authorization policy',
  POLICY_DECISION_UNAVAILABLE = 'Authorization service is temporarily unavailable',
}



import { AuthenticatedUser } from '@domain/entities/authenticated-user.entity';

export interface TokenValidatorPort {
  validate(token: string): Promise<AuthenticatedUser>;
}

export const TokenValidatorPortSymbol = Symbol('TokenValidatorPort');

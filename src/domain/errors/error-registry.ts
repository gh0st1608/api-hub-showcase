import { ErrorLayer } from '@app/domain/errors/error-layer';
import { HttpStatusResponse } from './http-code';
import { DomainErrorMessages, InfrastructureErrorMessages, SecurityErrorMessages } from './messages';

/**
 * Error code ranges:
 *  1xxx — domain / application errors
 *  2xxx — infrastructure errors
 *  3xxx — external integration errors
 */
export const ErrorRegistry = {
  // ─── 1xxx: Domain / Application ────────────────────────────────────────────

  SAMPLE_NOT_FOUND: {
    code: 1000,
    httpStatus: HttpStatusResponse.NOT_FOUND,
    title: 'SAMPLE_NOT_FOUND',
    message: DomainErrorMessages.SAMPLE_NOT_FOUND,
    layer: ErrorLayer.APPLICATION,
  },

  PROJECT_NOT_FOUND: {
    code: 1001,
    httpStatus: HttpStatusResponse.NOT_FOUND,
    title: 'PROJECT_NOT_FOUND',
    message: DomainErrorMessages.PROJECT_NOT_FOUND,
    layer: ErrorLayer.APPLICATION,
  },

  INVALID_PAYLOAD: {
    code: 1002,
    httpStatus: HttpStatusResponse.BAD_REQUEST,
    title: 'INVALID_PAYLOAD',
    message: DomainErrorMessages.INVALID_PAYLOAD,
    layer: ErrorLayer.APPLICATION,
  },

  // ─── 2xxx: Infrastructure ────────────────────────────────────────────────────

  DATABASE_ERROR: {
    code: 2000,
    httpStatus: HttpStatusResponse.SERVICE_UNAVAILABLE,
    title: 'DATABASE_ERROR',
    message: InfrastructureErrorMessages.DATABASE_CONNECTION_FAILED,
    layer: ErrorLayer.INFRASTRUCTURE,
  },

  SAVE_FAILED: {
    code: 2001,
    httpStatus: HttpStatusResponse.INTERNAL_SERVER_ERROR,
    title: 'SAVE_FAILED',
    message: InfrastructureErrorMessages.SAVE_FAILED,
    layer: ErrorLayer.INFRASTRUCTURE,
  },

  QUERY_FAILED: {
    code: 2002,
    httpStatus: HttpStatusResponse.INTERNAL_SERVER_ERROR,
    title: 'QUERY_FAILED',
    message: InfrastructureErrorMessages.QUERY_FAILED,
    layer: ErrorLayer.INFRASTRUCTURE,
  },

  // ─── 4xxx: Security / Authorization ─────────────────────────────────────────

  UNAUTHENTICATED: {
    code: 4000,
    httpStatus: HttpStatusResponse.UNAUTHORIZED,
    title: 'UNAUTHENTICATED',
    message: SecurityErrorMessages.UNAUTHENTICATED,
    layer: ErrorLayer.SECURITY,
  },

  INVALID_TOKEN: {
    code: 4001,
    httpStatus: HttpStatusResponse.UNAUTHORIZED,
    title: 'INVALID_TOKEN',
    message: SecurityErrorMessages.INVALID_TOKEN,
    layer: ErrorLayer.SECURITY,
  },

  TOKEN_EXPIRED: {
    code: 4002,
    httpStatus: HttpStatusResponse.UNAUTHORIZED,
    title: 'TOKEN_EXPIRED',
    message: SecurityErrorMessages.TOKEN_EXPIRED,
    layer: ErrorLayer.SECURITY,
  },

  INSUFFICIENT_SCOPE: {
    code: 4003,
    httpStatus: HttpStatusResponse.FORBIDDEN,
    title: 'INSUFFICIENT_SCOPE',
    message: SecurityErrorMessages.INSUFFICIENT_SCOPE,
    layer: ErrorLayer.SECURITY,
  },

  INSUFFICIENT_ROLE: {
    code: 4004,
    httpStatus: HttpStatusResponse.FORBIDDEN,
    title: 'INSUFFICIENT_ROLE',
    message: SecurityErrorMessages.INSUFFICIENT_ROLE,
    layer: ErrorLayer.SECURITY,
  },

  FORBIDDEN_BY_POLICY: {
    code: 4005,
    httpStatus: HttpStatusResponse.FORBIDDEN,
    title: 'FORBIDDEN_BY_POLICY',
    message: SecurityErrorMessages.FORBIDDEN_BY_POLICY,
    layer: ErrorLayer.SECURITY,
  },

  POLICY_DECISION_UNAVAILABLE: {
    code: 4006,
    httpStatus: HttpStatusResponse.SERVICE_UNAVAILABLE,
    title: 'POLICY_DECISION_UNAVAILABLE',
    message: SecurityErrorMessages.POLICY_DECISION_UNAVAILABLE,
    layer: ErrorLayer.SECURITY,
  },
} as const;
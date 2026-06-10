import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../metadata-keys';

/**
 * Marks a route or controller as public — skips JWT and OPA guards.
 * Use on health probes, public landing pages, or any unauthenticated endpoint.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

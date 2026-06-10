import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from '@infrastructure/adapters/inbound/http/auth/decorators/public.decorator';

/**
 * Liveness  → GET /health  (ECS container health check, Docker HEALTHCHECK)
 * Readiness → GET /ready   (load-balancer target-group health check)
 *
 * Excluded from the public API docs — internal ECS/ALB probes only.
 *
 * Add more indicators here as your app grows:
 *   - TypeOrmHealthIndicator (database)
 *   - HttpHealthIndicator    (downstream services)
 *   - MicroserviceHealthIndicator (queues)
 */
@ApiExcludeController()
@Public()
@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  /** Liveness — is the process alive? */
  @Get('health')
  @HealthCheck()
  liveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
    ]);
  }

  /** Readiness — is the app ready to receive traffic? */
  @Get('ready')
  @HealthCheck()
  readiness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 512 * 1024 * 1024),
    ]);
  }
}

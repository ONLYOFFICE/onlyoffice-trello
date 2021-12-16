import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { SkipThrottle } from '@nestjs/throttler';
import { PrometheusService } from '@services/prometheus.service';

/**
 * Prometheus metrics endpoint
 */
@Controller()
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get('metrics')
  @SkipThrottle()
  async metrics(@Res() res: Response) {
    res.setHeader('Content-Type', this.prometheusService.registry.contentType);
    const metrics = await this.prometheusService.registry.metrics();
    res.end(metrics);
  }
}

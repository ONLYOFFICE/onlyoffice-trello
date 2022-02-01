/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

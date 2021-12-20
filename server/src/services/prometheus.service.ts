import {Injectable} from '@nestjs/common';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService {
    public readonly registry: client.Registry;

    constructor() {
        this.registry = client.register;

        client.collectDefaultMetrics();
    }
}

import {Injectable, Logger} from '@nestjs/common';

import {RegistryService} from '@services/registry.service';
import {RedisCacheService} from '@services/redis.service';

import {Callback, DocKeySession} from '@models/callback';
import {CallbackHandler} from '@models/interfaces/handlers';
import { EventService } from '@services/event.service';

/**
 * Status 4 callback handler
 */
@Injectable()
export class ConventionalNoChangesCallbackHandler implements CallbackHandler {
    private readonly logger = new Logger(
        ConventionalNoChangesCallbackHandler.name,
    );
    id: string =
        new Date().getTime().toString() + ConventionalNoChangesCallbackHandler.name;

    constructor(
        private readonly cacheManager: RedisCacheService,
        private readonly registry: RegistryService,
        private readonly eventService: EventService,
    ) {
        this.registry.subscribe(this);
    }

    /**
   *
   * @param callback
   * @param payload
   * @returns
   */
    async handle(callback: Callback, _: string, session: DocKeySession) {
        if (callback.status !== 4) {
            return;
        }
        this.logger.debug(`No file ${session.Attachment} changes! Cleaning up`);
        // await this.cacheManager.docKeyCleanup(session.Attachment);
        this.eventService.emit(session.Attachment);
    }
}

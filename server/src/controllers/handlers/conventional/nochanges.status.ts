import { Injectable, Logger } from '@nestjs/common';

import { RegistryService } from '@services/registry.service';
import { EventService } from '@services/event.service';

import { Callback, DocKeySession } from '@models/callback';
import { CallbackHandler } from '@models/interfaces/handlers';

/**
 * Status 4 callback handler
 */
@Injectable()
export class ConventionalNoChangesCallbackHandler implements CallbackHandler {
    private readonly logger = new Logger(ConventionalNoChangesCallbackHandler.name);

    id: string =
        new Date().getTime().toString() + ConventionalNoChangesCallbackHandler.name;

    constructor(
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
    async handle(callback: Callback, session: DocKeySession) {
      if (callback.status !== 4) {
        return;
      }
      this.logger.debug(`No file ${session.Attachment} changes! Sending a cleanup event`);
      setTimeout(() => this.eventService.emit(session.Attachment), 600);
    }
}

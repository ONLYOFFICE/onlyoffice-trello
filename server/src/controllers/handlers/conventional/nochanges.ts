import { Injectable, Logger } from '@nestjs/common';
import { join } from 'path';

import { Callback } from '@models/callback';
import { CallbackHandler } from '@models/interfaces/handlers';
import { FilePayload } from '@models/payloads';
import { RegistryService } from '@services/registry.service';
import { FileService } from '@services/file.service';
import { RedisCacheService } from '@services/redis.service';
import { Constants } from '@utils/const';

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
    private readonly fileService: FileService,
    private readonly constants: Constants,
  ) {
    this.registry.subscribe(this);
  }

  /**
   *
   * @param callback
   * @param payload
   * @returns
   */
  async handle(callback: Callback, payload: FilePayload) {
    if (callback.status !== 4) return;
    this.logger.debug(`No file ${payload.attachment} changes! Cleaning up`);
    try {
      this.fileService.deleteFilestoreFolder(payload.attachment, payload.filename);
    } catch (err) {
      this.logger.error(err);
    } finally {
      await this.cacheManager.del(`${this.constants.PREFIX_DOC_KEY_CACHE}_${payload.attachment}`);
    }
  }
}

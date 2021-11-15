import { Injectable } from '@nestjs/common';

import { CallbackHandler } from '@models/interfaces/handlers';
import { Callback } from '@models/callback';
import { FilePayload } from '@models/payloads';

@Injectable()
export class RegistryService {
  public observers: CallbackHandler[] = [];

  public subscribe(ch: CallbackHandler) {
    this.observers.push(ch);
  }

  public unsubscribe(ch: CallbackHandler) {
    this.observers.filter((o) => o.id !== ch.id);
  }

  public run(callback: Callback, payload: FilePayload) {
    this.observers.forEach((handler) => {
      handler.handle(callback, payload);
    });
  }
}

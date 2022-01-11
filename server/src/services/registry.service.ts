import {Injectable} from '@nestjs/common';

import {CallbackHandler} from '@models/interfaces/handlers';
import {Callback} from '@models/callback';
import {EditorPayload} from '@models/payload';

/**
 *
 */
@Injectable()
export class RegistryService {
    public observers: CallbackHandler[] = [];

    /**
     *
     * @param ch
     */
    public subscribe(ch: CallbackHandler) {
        this.observers.push(ch);
    }

    /**
     *
     * @param ch
     */
    public unsubscribe(ch: CallbackHandler) {
        this.observers = this.observers.filter((o) => o.id !== ch.id);
    }

    /**
     *
     * @param callback
     * @param payload
     * @param uid
     */
    public run(callback: Callback, payload: EditorPayload, uid: string) {
        this.observers.forEach((handler) => {
            handler.handle(callback, payload, uid);
        });
    }
}

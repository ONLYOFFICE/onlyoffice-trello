import {Injectable} from '@nestjs/common';

import {CallbackHandler} from '@models/interfaces/handlers';
import {Callback, DocKeySession} from '@models/callback';

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
     * @param token
     * @param session
     */
    public run(callback: Callback, token: string, session: DocKeySession) {
        this.observers.forEach((handler) => {
            handler.handle(callback, token, session);
        });
    }
}

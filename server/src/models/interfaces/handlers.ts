/* eslint-disable no-unused-vars */
import { Callback, DocKeySession } from '@models/callback';

export interface CallbackHandler {
    id: string;
    handle: (callback: Callback, token: string, session: DocKeySession) => void;
}

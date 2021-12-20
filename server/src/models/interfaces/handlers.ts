import {Callback} from '@models/callback';
import {EditorPayload} from '@models/payload';

export interface CallbackHandler {
    id: string;
    handle: (callback: Callback, payload: EditorPayload, uid: string) => void;
}

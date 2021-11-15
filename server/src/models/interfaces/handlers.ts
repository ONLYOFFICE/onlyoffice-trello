import { Callback } from '@models/callback';
import { FilePayload } from '@models/payloads';

export interface CallbackHandler {
  id: string;
  handle: (callback: Callback, payload: FilePayload) => void;
}

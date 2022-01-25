/* eslint-disable */
import { Callback, DocKeySession } from '../../models/callback';
import { EditorPayload } from '../../models/payload';
import { CallbackHandler } from '../../models/interfaces/handlers';
import { RegistryService } from '../registry.service';

describe('Registry Service', () => {
  let registry: RegistryService;
  let handler: CallbackHandler;

  beforeEach(async () => {
    registry = new RegistryService();
    handler = {
      id: '0',
      handle: (callback: Callback, session: DocKeySession) => {

      }
    };
  });

  it('register a callback handler', () => {
    registry.subscribe(handler);
    expect(registry.observers.length).toBe(1);
  });

  it('remove a callback handler', () => {
    registry.subscribe(handler);
    expect(registry.observers.length).toBe(1);
    registry.unsubscribe(handler);
    expect(registry.observers.length).toBe(0);
  });
});

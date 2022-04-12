/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

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

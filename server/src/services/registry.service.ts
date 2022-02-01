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

import { Injectable } from '@nestjs/common';

import { CallbackHandler } from '@models/interfaces/handlers';
import { Callback, DocKeySession } from '@models/callback';

/**
 * ONLYOFFICE Callbacks registry
 */
@Injectable()
export class RegistryService {
    public observers: CallbackHandler[] = [];

    /**
     * Adds a new callback handler to the observers list
     * @param ch A callback handler
     */
    public subscribe(ch: CallbackHandler) {
      this.observers.push(ch);
    }

    /**
     * Removes a callback handler from the observers list
     * @param ch A callback handler
     */
    public unsubscribe(ch: CallbackHandler) {
      this.observers = this.observers.filter((o) => o.id !== ch.id);
    }

    /**
     * Invokes handle command
     * @param callback A Document server callback object
     * @param token A Trello User token
     * @param session A Sesssion object
     */
    public run(callback: Callback, session: DocKeySession) {
      this.observers.forEach((handler) => {
        handler.handle(callback, session);
      });
    }
}

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
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';

/**
 * A handy wrapper over event emitter (SSE)
 */
@Injectable()
export class EventService {
    private readonly emitter: EventEmitter;

    private readonly eventName = 'DOCUMENT_KEY';

    constructor() {
      this.emitter = new EventEmitter();
    }

    /**
     *
     * @returns
     */
    subscribe() {
      return fromEvent(this.emitter, this.eventName);
    }

    /**
     *
     * @param id
     */
    async emit(id: string) {
      this.emitter.emit(this.eventName, id);
    }
}

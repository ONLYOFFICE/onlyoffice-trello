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

/* eslint-disable @typescript-eslint/no-misused-promises */
import constants from 'root/utils/const';

import {Trello} from 'types/trello';

export const docKeyCleanup = (t: Trello.PowerUp.IFrame): void => {
  const eventSource = new EventSource(constants.ONLYOFFICE_SSE_ENDPOINT);
  const cleanup = async ({data}: {data: string}): Promise<void> => {
    try {
      await t.remove('card', 'shared', data);
    // eslint-disable-next-line no-empty
    } catch {}
    eventSource.removeEventListener('message', cleanup);
    eventSource.close();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    clearTimeout(timeout);
  };
  eventSource.addEventListener('message', cleanup);
  const timeout = setTimeout(() => {
    eventSource.removeEventListener('message', cleanup);
    eventSource.close();
  }, 15000);
};

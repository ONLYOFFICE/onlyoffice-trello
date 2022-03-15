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

import {docKeyCleanup} from 'root/api/handlers/documentKey';

import constants from 'root/utils/const';

import {Trello} from 'types/trello';
import {ActionProps} from 'types/power-up';

export function getCardButton(
  _t: Trello.PowerUp.IFrame,
  props: ActionProps,
): Trello.PowerUp.CardButton[] {
  return [
    {
      icon: props.baseUrl,
      text: 'ONLYOFFICE',
      condition: 'edit',
      callback: (t: Trello.PowerUp.IFrame) => t.modal({
        title: 'ONLYOFFICE',
        url: '/card-button',
        fullscreen: true,
        callback: async () => {
          const attachment = window.localStorage.
            getItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT);
          const attachmentKey = window.localStorage.
            getItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT_KEY);
          window.localStorage.
            removeItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT);
          window.localStorage.
            removeItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT_KEY);

          const storedKey = (await t.get('card', 'shared', attachment || '')) as string;

          if (attachmentKey === storedKey) {
            docKeyCleanup(t);
          }
        },
      }),
    },
  ];
}

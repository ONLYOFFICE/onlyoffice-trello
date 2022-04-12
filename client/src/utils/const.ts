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

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default Object.freeze({
  ONLYOFFICE_ACTIVE_SESSION: 'ONLYOFFICE_ACTIVE_ATTACHMENT',
  ONLYOFFICE_LOCAL_STORAGE_INFO_CLOSED: 'ONLYOFFICE_INFO_CLOSED',
  ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT: 'ONLYOFFICE_ATTACHMENT',
  ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT_KEY: 'ONLYOFFICE_ATTACHMENT_KEY',

  ONLYOFFICE_SSE_ENDPOINT: `${process.env.BACKEND_HOST!}/onlyoffice/events`,
  ONLYOFFICE_SETTINGS_ENDPOINT:
    `${process.env.BACKEND_HOST!}/onlyoffice/settings`,

  TRELLO_API: 'https://api.trello.com/1/',
  TRELLO_API_CARDS: 'https://api.trello.com/1/cards/',
  TRELLO_API_CARD(id: string): string {
    return this.TRELLO_API_CARDS + id;
  },
  TRELLO_API_CARD_ATTACHMENTS(id: string): string {
    return `${this.TRELLO_API_CARD(id)}/attachments`;
  },
  TRELLO_API_ME(token: string): string {
    return `${this.TRELLO_API}members/me`
     + `?key=${process.env.POWERUP_APP_KEY || ''}&token=${token}`;
  },
});

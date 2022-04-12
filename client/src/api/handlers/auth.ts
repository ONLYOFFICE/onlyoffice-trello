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
import {trello} from 'root/api/client';
import constants from 'root/utils/const';

const tokenInfo = {
  scope: 'read,write',
  expires: 'never',
};

export async function getAuth(): Promise<string> {
  const rest = trello.getRestApi() as any;
  let token = await rest.getToken();

  if (!token) {
    token = await rest.authorize(tokenInfo);
  }

  const res = await fetch(constants.TRELLO_API_ME(token));
  if (res.status != 200) {
    await rest.clearToken();
    token = await rest.authorize(tokenInfo);
  }

  if (!token) {
    throw new Error('Could not receive a valid token');
  }

  return token;
}

export function getBoardWriteMember(): boolean {
  return !!(trello.getContext().permissions?.board === 'write');
}

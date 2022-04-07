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

import decode from 'jwt-decode';

import {Trello} from 'types/trello';
import {SettingsOptions} from 'components/settings/types';

type Context = {
  organizationMembership: string;
  [key: string]: any;
}

export async function getSettings(
  t: Trello.PowerUp.IFrame,
  options: SettingsOptions,
): Promise<void> {
  const jwt = await t.jwt({});
  const context = decode<Context>(jwt);
  const shouldShow = options.context.permissions?.organization === 'write'
    && context.organizationMembership === 'admin';
  if (shouldShow) {
    return t.popup({
      title: 'ONLYOFFICE',
      url: './show-settings',
      height: 240,
    });
  }
}

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

import {Trello} from 'types/trello';
import {SettingsOptions} from 'components/settings/types';

export function getSettings(
  t: Trello.PowerUp.IFrame,
  options: SettingsOptions,
): PromiseLike<void> | undefined {
  if (options.context.permissions?.organization === 'write') {
    return t.popup({
      title: 'ONLYOFFICE',
      url: './show-settings',
      height: 240,
    });
  }
}

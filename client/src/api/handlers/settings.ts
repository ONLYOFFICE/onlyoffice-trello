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
import i18next from 'i18next';

import {trello} from 'root/api/client';
import {generateSettingsSignature} from 'root/api/handlers/signature';

import constants from 'root/utils/const';
import {fetchWithTimeout} from 'root/utils/withTimeout';

import {DocServerInfo} from 'components/card-button/types';
import {SettingsData} from 'components/settings/types';
import {TrelloSettings} from 'types/trello';
import {validURL} from 'root/utils/validation';

const settingsHandler = {
  get: async (type: TrelloSettings): Promise<string> => {
    return trello.get('organization', 'shared', type);
  },
  getPrivate: async (type: TrelloSettings): Promise<string> => {
    return trello.get('organization', 'private', type);
  },
  set: async (type: TrelloSettings, value: string) => {
    await trello.set('organization', 'shared', type, value);
  },
  setPrivate: async (type: TrelloSettings, value: string) => {
    await trello.set('organization', 'private', type, value);
  },
};

export const fetchDocsInfo = async (): Promise<DocServerInfo> => {
  return await trello.get('organization', 'shared') as DocServerInfo;
};

export const fetchSettings = async (): Promise<SettingsData> => {
  let data: SettingsData = {};
  try {
    data.Address = await settingsHandler.get('docsAddress');
    data.Header = await settingsHandler.get('docsHeader');
    data.Jwt = await settingsHandler.get('docsJwt');
    if (data.Jwt) {
      const signature = await generateSettingsSignature();
      const response = await fetchWithTimeout(
        `${constants.ONLYOFFICE_SETTINGS_ENDPOINT}/decrypt?signature=${signature}`,
        {timeout: 3000},
        {
          method: 'POST',
          cache: 'no-cache',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: data.Jwt,
          }),
        },
      );
      if (response.status !== 200) {
        throw new Error(i18next.t('onlyoffice.configure.save.failure.fetch'));
      }
      data.Jwt = await response.text();
    }
  } catch {
    data = {};
    await trello.alert({
      message: i18next.t('onlyoffice.configure.save.failure.fetch'),
      duration: 15,
      display: 'error',
    });
  }
  return data;
};

export const saveSettings = async (settings: SettingsData): Promise<void> => {
  if (!settings.Jwt || !settings.Header || !settings.Address) {
    await trello.alert({
      message: i18next.t('onlyoffice.configure.save.failure.empty'),
      duration: 15,
      display: 'error',
    });
    return;
  }
  try {
    const formattedAddress = settings.Address.trim().
      endsWith('/') ? settings.Address.trim() : `${settings.Address.trim()}/`;
    const isValid = validURL(formattedAddress);
    if (!isValid) {
      throw new Error('Invalid URL format');
    }
    const signature = await generateSettingsSignature();
    const response = await fetchWithTimeout(
      `${constants.ONLYOFFICE_SETTINGS_ENDPOINT}/encrypt?signature=${signature}`,
      {timeout: 3000},
      {
        method: 'POST',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: settings.Jwt,
        }),
      },
    );
    if (response.status !== 200) {
      throw new Error(i18next.t('onlyoffice.configure.save.failure'));
    }
    const secureSecret = await response.text();
    await Promise.all([
      settingsHandler.set('docsAddress', formattedAddress),
      settingsHandler.set('docsHeader', settings.Header),
      settingsHandler.set('docsJwt', secureSecret),
    ]);
    await trello.alert({
      message: i18next.t('onlyoffice.configure.save.success'),
      duration: 15,
      display: 'info',
    });
    await trello.closePopup();
  } catch {
    await trello.alert({
      message: i18next.t('onlyoffice.configure.save.failure'),
      duration: 15,
      display: 'error',
    });
  }
};

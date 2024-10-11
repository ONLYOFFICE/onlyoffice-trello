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
import i18next from 'i18next';

import {trello} from 'root/api/client';
import {generateSettingsSignature} from 'root/api/handlers/signature';

import constants from 'root/utils/const';
import {fetchWithTimeout} from 'root/utils/withTimeout';

import {DocServerInfo} from 'components/card-button/types';
import {SettingsData} from 'components/settings/types';
import {TrelloSettings} from 'types/trello';
import {validURL} from 'root/utils/validation';

type Context = {
  organizationMembership: string;
  boardMembership: string;
}

const settingsHandler = {
  getBoard: async (type: TrelloSettings): Promise<string> => {
    return trello.get('board', 'shared', type);
  },
  setBoard: async (type: TrelloSettings, value: string) => {
    await trello.set('board', 'shared', type, value);
  },
  removeBoard: async (type: TrelloSettings): Promise<void> => {
    return trello.remove('board', 'shared', type);
  },
  getOrganization: async (type: TrelloSettings): Promise<string> => {
    return trello.get('organization', 'shared', type);
  },
  setOrganization: async (type: TrelloSettings, value: string) => {
    await trello.set('organization', 'shared', type, value);
  },
  removeOrganization: async (type: TrelloSettings): Promise<void> => {
    return trello.remove('organization', 'shared', type);
  },
};

export const useSharedSettings = async (): Promise<boolean> => {
  let useShared = false;
  try {
    const docsUseShared = await settingsHandler.getBoard('docsUseShared');
    useShared = docsUseShared === 'true' || !docsUseShared;
  } catch {
    useShared = false;
  }
  return useShared;
};

export const hasSharedSettings = async (): Promise<boolean> => {
  let hasShared = false;
  try {
    hasShared = await settingsHandler.getOrganization('docsHasShared') === 'true';
  } catch {
    hasShared = false;
  }
  return hasShared;
};

export const fetchDocsInfo = async (): Promise<DocServerInfo> => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (await useSharedSettings()) {
    return await trello.get('organization', 'shared') as DocServerInfo;
  }
  return await trello.get('board', 'shared') as DocServerInfo;
};

export const fetchSettings = async (): Promise<SettingsData> => {
  let data: SettingsData = {};
  try {
    const jwt = await trello.jwt({});
    const context = decode<Context>(jwt);
    const organizationMembership = context.organizationMembership === 'admin';
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const useShared = await useSharedSettings();
    if (useShared) {
      if (organizationMembership) {
        data.Address = await settingsHandler.getOrganization('docsAddress');
        data.Header = await settingsHandler.getOrganization('docsHeader');
        data.Jwt = await settingsHandler.getOrganization('docsJwt');
      } else {
        data = {};
        return data;
      }
    } else {
      data.Address = await settingsHandler.getBoard('docsAddress');
      data.Header = await settingsHandler.getBoard('docsHeader');
      data.Jwt = await settingsHandler.getBoard('docsJwt');
    }
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

const successSaveAlert = async (): Promise<void> => {
  await trello.alert({
    message: i18next.t('onlyoffice.configure.save.success'),
    duration: 15,
    display: 'info',
  });
  await trello.closePopup();
};

const failureSaveAlert = async (): Promise<void> => {
  await trello.alert({
    message: i18next.t('onlyoffice.configure.save.failure'),
    duration: 15,
    display: 'error',
  });
  await trello.closePopup();
};

const emptySaveAlert = async (): Promise<void> => {
  await trello.alert({
    message: i18next.t('onlyoffice.configure.save.failure'),
    duration: 15,
    display: 'error',
  });
  await trello.closePopup();
};

const formattedAddress = (address: string): string => {
  const docsAddress = address.trim().endsWith('/') ? address.trim() : `${address.trim()}/`;
  const isValid = validURL(docsAddress);
  if (!isValid) {
    throw new Error('Invalid URL format');
  }
  return docsAddress;
};

const secureSecret = async (jwt: string): Promise<string> => {
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
        secret: jwt,
      }),
    },
  );
  if (response.status !== 200) {
    throw new Error(i18next.t('onlyoffice.configure.save.failure'));
  }
  const docsJwt = await response.text();
  return docsJwt;
};

export const saveSharedSettings = async (settings: SettingsData): Promise<void> => {
  try {
    const jwt = await trello.jwt({});
    const context = decode<Context>(jwt);
    const organizationMembership = context.organizationMembership === 'admin';
    if (!organizationMembership) {
      return;
    }
    if (!settings.Jwt && !settings.Header && !settings.Address) {
      await Promise.all([
        settingsHandler.removeOrganization('docsAddress'),
        settingsHandler.removeOrganization('docsHeader'),
        settingsHandler.removeOrganization('docsJwt'),
        settingsHandler.setOrganization('docsHasShared', JSON.stringify(false)),
        settingsHandler.setBoard('docsUseShared', JSON.stringify(false)),
      ]);
      await successSaveAlert();
      return;
    }
    if (!settings.Jwt || !settings.Header || !settings.Address) {
      await emptySaveAlert();
      return;
    }
    const docsAddress = formattedAddress(settings.Address);
    const docsJwt = await secureSecret(settings.Jwt);
    await Promise.all([
      settingsHandler.setOrganization('docsAddress', docsAddress),
      settingsHandler.setOrganization('docsHeader', settings.Header),
      settingsHandler.setOrganization('docsJwt', docsJwt),
      settingsHandler.setOrganization('docsHasShared', JSON.stringify(true)),
      settingsHandler.setBoard('docsUseShared', JSON.stringify(true)),
    ]);
    await successSaveAlert();
  } catch {
    await failureSaveAlert();
  }
};

export const saveLocalSettings = async (settings: SettingsData, asLocal: boolean): Promise<void> => {
  try {
    if (!asLocal) {
      await Promise.all([
        settingsHandler.removeBoard('docsAddress'),
        settingsHandler.removeBoard('docsHeader'),
        settingsHandler.removeBoard('docsJwt'),
        settingsHandler.setBoard('docsUseShared', JSON.stringify(true)),
      ]);
      await successSaveAlert();
      return;
    }
    if (!settings.Jwt && !settings.Header && !settings.Address) {
      await Promise.all([
        settingsHandler.removeBoard('docsAddress'),
        settingsHandler.removeBoard('docsHeader'),
        settingsHandler.removeBoard('docsJwt'),
        settingsHandler.setBoard('docsUseShared', JSON.stringify(false)),
      ]);
      await successSaveAlert();
      return;
    }
    if (!settings.Jwt || !settings.Header || !settings.Address) {
      await emptySaveAlert();
      return;
    }
    const docsAddress = formattedAddress(settings.Address);
    const docsJwt = await secureSecret(settings.Jwt);
    await Promise.all([
      settingsHandler.setBoard('docsAddress', docsAddress),
      settingsHandler.setBoard('docsHeader', settings.Header),
      settingsHandler.setBoard('docsJwt', docsJwt),
      settingsHandler.setBoard('docsUseShared', JSON.stringify(false)),
    ]);
    await successSaveAlert();
  } catch {
    await failureSaveAlert();
  }
};

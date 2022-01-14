import {trello} from 'root/api/client';
import {generateSettingsSignature} from 'root/api/handlers/signature';

import constants from 'root/utils/const';

import {DocServerInfo} from 'components/card-button/types';
import {SettingsData} from 'components/settings/types';
import {TrelloSettings} from 'types/trello';

export const settingsHandler = {
  get: async (type: TrelloSettings): Promise<string> => {
    return trello.get('board', 'shared', type);
  },
  getPrivate: async (type: TrelloSettings): Promise<string> => {
    return trello.get('board', 'private', type);
  },
  set: async (type: TrelloSettings, value: string) => {
    await trello.set('board', 'shared', type, value);
  },
  setPrivate: async (type: TrelloSettings, value: string) => {
    await trello.set('board', 'private', type, value);
  },
};

export const fetchDocsInfo = async (): Promise<DocServerInfo> => {
  return await trello.get('board', 'shared') as DocServerInfo;
};

export const fetchSettings = async (): Promise<SettingsData> => {
  let data: SettingsData = {};
  try {
    data.Address = await settingsHandler.get('docsAddress');
    data.Header = await settingsHandler.get('docsHeader');
    data.Jwt = await settingsHandler.get('docsJwt');
  } catch {
    data = {};
    await trello.alert({
      message: 'Could not fetch ONLYOFFICE settings, try again later',
      duration: 15,
      display: 'error',
    });
  }
  return data;
};

export const saveSettings = async (settings: SettingsData): Promise<void> => {
  if (!settings.Jwt || !settings.Header || !settings.Address) {
    await trello.alert({
      message: 'Could not save ONLYOFFICE settings with empty fields',
      duration: 15,
      display: 'error',
    });
    return;
  }
  try {
    const signature = await generateSettingsSignature();
    const response = await fetch(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      `${constants.ONLYOFFICE_SETTINGS_ENDPOINT}?signature=${signature}`,
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
      throw new Error('Could not save ONLYOFFICE settings');
    }
    const secureSecret = await response.text();
    await Promise.all([
      settingsHandler.set('docsAddress', settings.Address),
      settingsHandler.set('docsHeader', settings.Header),
      settingsHandler.set('docsJwt', secureSecret),
    ]);
    await trello.alert({
      message: 'ONLYOFFICE settings have been saved',
      duration: 15,
      display: 'info',
    });
    await trello.closePopup();
  } catch {
    await trello.alert({
      message: 'Could not save ONLYOFFICE settings',
      duration: 15,
      display: 'error',
    });
  }
};

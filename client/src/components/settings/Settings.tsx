/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useEffect, useState} from 'react';

import constants from 'root/utils/const';
import {trelloSettingsHandler} from 'root/api/handlers/settings';
import {trello} from 'root/api/client';

import {SettingsData} from 'components/settings/types';

import './styles.css';

const settingsHandler = trelloSettingsHandler();

const fetchSettings = async (): Promise<SettingsData> => {
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

const saveSettings = async (settings: SettingsData): Promise<void> => {
  if (!settings.Jwt || !settings.Header || !settings.Address) {
    await trello.alert({
      message: 'Could not save ONLYOFFICE settings with empty fields',
      duration: 15,
      display: 'error',
    });
    return;
  }
  try {
    const response = await fetch(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      constants.ONLYOFFICE_SETTINGS_ENDPOINT,
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

export default function SettingsComponent(): JSX.Element {
  const [settingsData, setSettingsData] = useState<SettingsData>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const handler = async (): Promise<void> => {
      const data = await fetchSettings();
      setSettingsData(data);
      await trello.sizeTo('#onlyoffice-settings');
    };
    // eslint-disable-next-line
    handler().then(() => trello.render((): void => {}));
  }, []);
  return (
      <div id='onlyoffice-settings'>
          <div>
              <p>Configure ONLYOFFICE</p>
              <p>Document Server Address</p>
              <input
                  disabled={saving}
                  type='text'
                  value={settingsData?.Address}
                  onChange={(e) => setSettingsData({
                    ...settingsData,
                    Address: e.target.value,
                  })}
              />
              <p>JWT Secret</p>
              <input
                  disabled={saving}
                  type='text'
                  value={settingsData?.Jwt}
                  onChange={(e) => setSettingsData({
                    ...settingsData,
                    Jwt: e.target.value,
                  })}
              />
              <p>JWT Header</p>
              <input
                  disabled={saving}
                  type='text'
                  value={settingsData?.Header}
                  onChange={(e) => setSettingsData({
                    ...settingsData,
                    Header: e.target.value,
                  })}
              />
              <button
                  disabled={saving}
                  type='button'
                  onClick={async () => {
                    setSaving(true);
                    await saveSettings(settingsData);
                    setSaving(false);
                  }}
              >
                  Save
              </button>
          </div>
      </div>
  );
}

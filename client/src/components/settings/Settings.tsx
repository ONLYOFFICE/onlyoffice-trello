/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useEffect, useState} from 'react';

import {trello} from 'root/api/client';
import {fetchSettings, saveSettings} from 'root/api/handlers/settings';

import {SettingsData} from 'components/settings/types';

import './styles.css';

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

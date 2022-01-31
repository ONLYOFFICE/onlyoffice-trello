/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useEffect, useState} from 'react';
import Button from '@atlaskit/button';
import ShowIcon from '@atlaskit/icon/glyph/hipchat/audio-only';
import Spinner from '@atlaskit/spinner';

import {trello} from 'root/api/client';
import {fetchSettings, saveSettings} from 'root/api/handlers/settings';

import {Info} from 'components/settings/Info';
import {SettingsData} from 'components/settings/types';

import './styles.css';

const defaultAddress = 'https://<host>/';
const defaultHeader = 'Authorization';

export default function SettingsComponent(): JSX.Element {
  const [settingsData, setSettingsData] = useState<SettingsData>({});
  const [hideSecret, setHideSecret] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const handler = async (): Promise<void> => {
      const data = await fetchSettings();
      setSettingsData(data);
      setLoading(false);
      await trello.sizeTo('#onlyoffice_settings');
    };
    // eslint-disable-next-line
    handler().then(() => trello.render((): void => {}));
  }, []);
  return (
      <div id='onlyoffice_settings'>
          <div className='onlyoffice_settings_container'>
              {loading && (
              <div className='onlyoffice_settings_container__loader'>
                  <Spinner size='large'/>
              </div>
              )}
              {!loading && (
              <form>
                  <p className='onlyoffice_settings_container__header'>
                      Configure ONLYOFFICE
                  </p>
                  <p>Document Server Address</p>
                  <input
                      disabled={saving}
                      type='text'
                      placeholder={defaultAddress}
                      value={settingsData?.Address}
                      autoComplete='on'
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        Address: e.target.value,
                      })}
                  />
                  <p>JWT Secret</p>
                  <div style={{display: 'flex'}}>
                      <input
                          disabled={saving}
                          type={hideSecret ? 'password' : 'text'}
                          placeholder='secret'
                          value={settingsData?.Jwt}
                          autoComplete='on'
                          onChange={(e) => setSettingsData({
                            ...settingsData,
                            Jwt: e.target.value,
                          })}
                      />
                      <Button
                          style={{marginTop: '0.125rem', marginLeft: '0.5rem'}}
                          iconAfter={(
                              <ShowIcon
                                  label='show'
                                  size='small'
                              />
                          )}
                          onMouseDown={() => setHideSecret(false)}
                          onMouseUp={() => setHideSecret(true)}
                      />
                  </div>
                  <p>JWT Header</p>
                  <input
                      disabled={saving}
                      type='text'
                      placeholder={defaultHeader}
                      value={settingsData?.Header}
                      autoComplete='on'
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        Header: e.target.value,
                      })}
                  />
                  <Info/>
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
              </form>
              )}
          </div>
      </div>
  );
}

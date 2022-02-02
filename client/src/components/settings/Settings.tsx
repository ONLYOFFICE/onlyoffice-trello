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

/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
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
  const {t, i18n} = useTranslation();
  const [settingsData, setSettingsData] = useState<SettingsData>({});
  const [hideSecret, setHideSecret] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const handler = async (): Promise<void> => {
      await i18n.changeLanguage(window.locale);
      const data = await fetchSettings();
      setSettingsData(data);
      setLoading(false);
      await trello.sizeTo('#onlyoffice_settings');
    };
    // eslint-disable-next-line
    handler().then(() => trello.render((): void => {}));
  }, [i18n]);
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
                      {t('onlyoffice.configure.header')}
                  </p>
                  <p>{t('onlyoffice.ds.address')}</p>
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
                  <p>{t('onlyoffice.ds.jwt.secret')}</p>
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
                  <p>{t('onlyoffice.ds.jwt.header')}</p>
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
                      {t('onlyoffice.configure.button')}
                  </button>
              </form>
              )}
          </div>
      </div>
  );
}

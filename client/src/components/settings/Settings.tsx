/* eslint-disable jsx-a11y/label-has-associated-control */
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

/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Button from '@atlaskit/button';
import ShowIcon from '@atlaskit/icon/glyph/hipchat/audio-only';
import Spinner from '@atlaskit/spinner';

import {trello} from 'root/api/client';
import {
  useSharedSettings,
  hasSharedSettings,
  fetchSettings,
  saveSharedSettings,
  saveLocalSettings,
} from 'root/api/handlers/settings';

import {Info} from 'components/settings/Info';
import {SettingsData} from 'components/settings/types';

import './styles.css';

type Context = {
  organizationMembership: string;
  boardMembership: string;
}

type AdminType = 'organization' | 'board';

const defaultAddress = 'https://<host>/';
const defaultHeader = 'Authorization';

export default function SettingsComponent(): JSX.Element {
  const {t, i18n} = useTranslation();
  const [adminType, setAdminType] = useState<AdminType>('board');
  const [settingsData, setSettingsData] = useState<SettingsData>({});
  const [asShared, setAsShared] = useState<boolean>(false);
  const [hasShared, setHasShared] = useState<boolean>(false);
  const [asLocal, setAsLocal] = useState<boolean>(false);
  const [hideSecret, setHideSecret] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const handler = async (): Promise<void> => {
      const jwt = await trello.jwt({});
      const context = decode<Context>(jwt);
      setAdminType(context.organizationMembership === 'admin' ? 'organization' : 'board');
      await i18n.changeLanguage(window.locale);
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const useShared = await useSharedSettings();
      const hasSharedData = await hasSharedSettings();
      if (useShared && hasSharedData) {
        setAsShared(true);
      }
      if (!useShared || !hasSharedData) {
        setAsLocal(true);
      }
      const data = await fetchSettings();
      if (!data.Header) {
        data.Header = 'Authorization';
      }
      setHasShared(hasSharedData);
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
              {hasShared && adminType === 'board' && (
              <>
                  <p>{t('onlyoffice.configure.local.description')}</p>
                  <label htmlFor='localSetting'>
                      <input
                          disabled={saving}
                          type='checkbox'
                          id='localSetting'
                          checked={asLocal}
                          onChange={(e) => {
                            setSettingsData({
                              Address: '',
                              Jwt: '',
                              Header: '',
                            });
                            setAsLocal(e.target.checked);
                          }}
                      />
                      {t('onlyoffice.configure.local.checkbox')}
                  </label>
              </>
              )}
              {!loading && (
              <form>
                  <p className='onlyoffice_settings_container__header'>
                      {t('onlyoffice.configure.header')}
                  </p>
                  <p>{t('onlyoffice.ds.address')}</p>
                  <input
                      disabled={saving || (!asLocal && adminType === 'board')}
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
                          disabled={saving || (!asLocal && adminType === 'board')}
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
                      disabled={saving || (!asLocal && adminType === 'board')}
                      type='text'
                      placeholder={defaultHeader}
                      value={settingsData?.Header}
                      autoComplete='on'
                      onChange={(e) => setSettingsData({
                        ...settingsData,
                        Header: e.target.value,
                      })}
                  />
                  {adminType === 'organization' && (
                  <label htmlFor='sharedSettings'>
                      <input
                          disabled={saving}
                          type='checkbox'
                          id='sharedSettings'
                          checked={asShared}
                          onChange={(e) => {
                            setAsShared(e.target.checked);
                          }}
                      />
                      {t('onlyoffice.configure.share.checkbox')}
                  </label>
                  )}
                  <Info/>
                  <button
                      disabled={saving}
                      type='button'
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={async () => {
                        setSaving(true);
                        if (adminType === 'organization') {
                          if (asShared) {
                            await saveSharedSettings(settingsData);
                          } else {
                            await saveLocalSettings(settingsData, true);
                          }
                        } else {
                          await saveLocalSettings(settingsData, asLocal);
                        }
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

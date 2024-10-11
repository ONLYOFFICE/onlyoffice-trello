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
  idMember: string;
}

type AdminType = 'organization' | 'board' | 'none';

const defaultAddress = 'https://<host>/';
const defaultSecret = 'secret';
const defaultHeader = 'Authorization';

export default function SettingsComponent(): JSX.Element {
  const {t, i18n} = useTranslation();
  const [adminType, setAdminType] = useState<AdminType>('none');
  const [settingsData, setSettingsData] = useState<SettingsData>({});
  const [asShared, setAsShared] = useState<boolean>(false);
  const [hasShared, setHasShared] = useState<boolean>(false);
  const [asLocal, setAsLocal] = useState<boolean>(false);
  const [hideSecret, setHideSecret] = useState(true);
  const [hideHeader, setHideHeader] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const handler = async (): Promise<void> => {
      await i18n.changeLanguage(window.locale);

      const jwt = await trello.jwt({});
      const context = decode<Context>(jwt);
      const {memberships} = await trello.board('memberships');
      const member = memberships.find((m) => m.idMember === context.idMember);

      const isBoardAdmin = member?.memberType === 'admin';
      const isBoardMember = member?.memberType === 'admin' || member?.memberType === 'normal';
      const isOrganizationAdmin = context.organizationMembership === 'admin';

      if ((isOrganizationAdmin && isBoardMember) || isBoardAdmin) {
        setAdminType(isOrganizationAdmin ? 'organization' : 'board');
        const data = await fetchSettings();
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const useShared = await useSharedSettings();
        const hasSharedData = await hasSharedSettings();
        if (useShared && hasSharedData) {
          setAsShared(true);
        }
        if (!useShared || !hasSharedData) {
          setAsLocal(true);
        }
        setHasShared(hasSharedData);
        setSettingsData(data);
      }
      setLoading(false);
      await trello.sizeTo('#onlyoffice_settings');
    };
    // eslint-disable-next-line
    handler().then(() => trello.render((): void => {}));
  }, [i18n]);
  return (
      <div id='onlyoffice_settings'>
          {adminType === 'none' ? (
              <div className='onlyoffice_board_access'>
                  <p style={{margin: '0'}}>{t('onlyoffice.configure.access.title')}</p>
                  <p style={{margin: '0'}}>{t('onlyoffice.configure.access.description')}</p>
              </div>
          ) : (
              <div className='onlyoffice_settings_container'>
                  {loading && (
                  <div className='onlyoffice_settings_container__loader'>
                      <Spinner size='large'/>
                  </div>
                  )}
                  {!loading && (
                  <form style={{display: 'flex', flexDirection: 'column', rowGap: '16px'}}>
                      <p style={{margin: '0'}}>{t('onlyoffice.configure.header')}</p>
                      {hasShared && adminType === 'board' && (
                      <div>
                          <p style={{margin: '0 0 6px'}}>
                              {t('onlyoffice.configure.local.description')}
                          </p>
                          <label
                              htmlFor='localSetting'
                              style={{display: 'flex', margin: '0'}}
                          >
                              <input
                                  style={{margin: '0 4px 0 0', boxShadow: 'none'}}
                                  disabled={saving}
                                  type='checkbox'
                                  id='localSetting'
                                  checked={asLocal}
                                  onChange={(e) => {
                                    const data = {
                                      Address: '',
                                      Jwt: '',
                                      Header: '',
                                    };
                                    setSettingsData(data);
                                    setAsLocal(e.target.checked);
                                  }}
                              />
                              <span>{t('onlyoffice.configure.local.checkbox')}</span>
                          </label>
                      </div>
                      )}
                      <div>
                          <p style={{margin: '0 0 8px'}}>{t('onlyoffice.ds.address')}</p>
                          <input
                              style={{margin: '0'}}
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
                      </div>
                      <div>
                          <p style={{margin: '0 0 8px'}}>{t('onlyoffice.ds.jwt.secret')}</p>
                          <div style={{position: 'relative'}}>
                              <input
                                  style={{margin: '0'}}
                                  disabled={saving || (!asLocal && adminType === 'board')}
                                  type={hideSecret ? 'password' : 'text'}
                                  placeholder={
                                    // eslint-disable-next-line max-len
                                    adminType === 'board' && !asLocal ? '••••••' : defaultSecret
                                  }
                                  value={settingsData?.Jwt}
                                  autoComplete='on'
                                  onChange={(e) => setSettingsData({
                                    ...settingsData,
                                    Jwt: e.target.value,
                                  })}
                              />
                              <Button
                                  style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    marginTop: '0.125rem',
                                    backgroundColor: '#ffffff00',
                                  }}
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
                      </div>
                      <div>
                          <p style={{margin: '0 0 8px'}}>{t('onlyoffice.ds.jwt.header')}</p>

                          <div style={{position: 'relative'}}>
                              <input
                                  style={{margin: '0'}}
                                  disabled={saving || (!asLocal && adminType === 'board')}
                                  type={hideHeader ? 'password' : 'text'}
                                  placeholder={
                                    // eslint-disable-next-line max-len
                                    adminType === 'board' && !asLocal ? '••••••' : defaultHeader
                                  }
                                  value={settingsData?.Header}
                                  autoComplete='on'
                                  onChange={(e) => setSettingsData({
                                    ...settingsData,
                                    Header: e.target.value,
                                  })}
                              />
                              <Button
                                  style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    marginTop: '0.125rem',
                                    backgroundColor: '#ffffff00',
                                  }}
                                  iconAfter={(
                                      <ShowIcon
                                          label='show'
                                          size='small'
                                      />
                              )}
                                  onMouseDown={() => setHideHeader(false)}
                                  onMouseUp={() => setHideHeader(true)}
                              />
                          </div>
                      </div>
                      {adminType === 'organization' && (
                      <label
                          htmlFor='sharedSettings'
                          style={{display: 'flex', margin: '0'}}
                      >
                          <input
                              style={{margin: '0 4px 0 0', boxShadow: 'none'}}
                              disabled={saving}
                              type='checkbox'
                              id='sharedSettings'
                              checked={asShared}
                              onChange={(e) => {
                                setAsShared(e.target.checked);
                              }}
                          />
                          <span>{t('onlyoffice.configure.share.checkbox')}</span>
                      </label>
                      )}
                      <Info/>
                      <Button
                          style={{margin: '0', width: 'fit-content'}}
                          appearance='primary'
                          isDisabled={saving}
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
                      </Button>
                  </form>
                  )}
              </div>
          )}
      </div>
  );
}

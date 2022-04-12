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

import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';

import constants from 'root/utils/const';

import info from 'public/images/info.svg';
import cross from 'public/images/cross.svg';
import './styles.css';

const handleCloseAnimation = (): void => {
  const infoContainer = document.getElementById('onlyoffice_info-container');
  infoContainer?.classList.add('onlyoffice_info-container_close');
};

export function Info(): JSX.Element | null {
  const {t} = useTranslation();
  const [closed, setClosed] = useState(
    () => Boolean(
      localStorage.getItem(constants.ONLYOFFICE_LOCAL_STORAGE_INFO_CLOSED),
    ) || false,
  );

  const handleClose = useCallback(() => {
    handleCloseAnimation();
    setTimeout(() => {
      setClosed(true);
    }, 300);
  }, []);

  const handlePermanentClose = useCallback(() => {
    localStorage.setItem(
      constants.ONLYOFFICE_LOCAL_STORAGE_INFO_CLOSED,
      'true',
    );
    handleClose();
  }, [handleClose]);

  if (closed) {
    return null;
  }

  return (
      <div
          id='onlyoffice_info-container'
          className='onlyoffice_info-container'
      >
          <div className='onlyoffice_info-container__top'>
              <img
                  alt='info badge'
                  className='onlyoffice_info-container__top_icon'
                  style={{
                    marginLeft: '1rem',
                    marginRight: '0.5rem',
                    width: '1rem',
                    cursor: 'default',
                  }}
                  src={info as string}
              />
              <b className='onlyoffice_info-container__text'>
                  {t('onlyoffice.files.info.main')}
              </b>
              {/* eslint-disable-next-line */}
              <img
                  alt='info close button'
                  className='onlyoffice_info-container__top_icon'
                  style={{paddingRight: '1rem', width: '0.5rem'}}
                  src={cross as string}
                  onClick={handleClose}
              />
          </div>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
              role='button'
              tabIndex={0}
              className='onlyoffice_info-container__bottom'
              onClick={handlePermanentClose}
              onKeyPress={
                (e) => (e.key === 'Enter' ? handlePermanentClose() : null)
              }
          >
              {t('onlyoffice.files.info.footer')}
          </a>
      </div>
  );
}

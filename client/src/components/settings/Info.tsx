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

import React from 'react';
import {useTranslation} from 'react-i18next';

const handleClick = (): void => {
  window.open('https://www.onlyoffice.com/docs-enterprise-prices.aspx');
};

export function Info(): JSX.Element {
  const {t} = useTranslation();
  return (
      <div
          className='onlyoffice_settings__info'
      >
          <p className='onlyoffice_settings__info__text'>
              {t('onlyoffice.configure.info.main')}
          </p>
          <button
              className='onlyoffice_settings__info__button'
              type='button'
              onClick={handleClick}
          >
              {t('onlyoffice.configure.info.button')}
          </button>
      </div>
  );
}

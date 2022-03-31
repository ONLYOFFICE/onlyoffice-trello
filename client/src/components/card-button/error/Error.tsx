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

import './styles.css';

export function Error({header, body}: {header?: string, body?: string}): JSX.Element {
  const {t} = useTranslation();
  return (
      <div className='onlyoffice_error'>
          <p className='onlyoffice_error__header'>
              {t(header || 'onlyoffice.files.error.header')}
          </p>
          <p className='onlyoffice_error__text'>
              {t(body || 'onlyoffice.files.error.body')}
          </p>
          <div className='onlyoffice_error__background'/>
          <div className='onlyoffice_error__background'/>
          <div className='onlyoffice_error__background'/>
      </div>
  );
}

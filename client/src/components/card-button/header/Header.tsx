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

/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import {Searchbar} from 'components/card-button/searchbar/Searchbar';

import logo from 'public/images/logo.svg';
import './styles.css';

export function Header(): JSX.Element {
  return (
      <div className='onlyoffice_modal-header'>
          <img
              alt='ONLYOFFICE'
              src={logo as string}
              style={{cursor: 'pointer'}}
              onClick={() => window.open('https://www.onlyoffice.com/')}
          />
          <Searchbar/>
      </div>
  );
}

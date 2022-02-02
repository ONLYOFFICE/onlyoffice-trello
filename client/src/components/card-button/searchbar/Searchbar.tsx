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

import {useStore} from 'root/context';

import search from 'public/images/search.svg';
import './styles.css';

export function Searchbar(): JSX.Element {
  const {t} = useTranslation();
  const store = useStore();
  const [query, setQuery] = useState<string>('');
  const handleQuery = useCallback(() => {
    store.card.filters.search = query;
  }, [query, store]);
  return (
      <div id='onlyoffice_searchbar-container'>
          <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleQuery}
              id='onlyoffice_searchbar-container__input'
              type='text'
              placeholder={t('onlyoffice.files.searchbar')}
          />
          <button
              id='onlyoffice_searchbar-container__btn'
              type='submit'
              onClick={handleQuery}
          >
              <img
                  alt='search'
                  src={search as string}
              />
          </button>
      </div>
  );
}

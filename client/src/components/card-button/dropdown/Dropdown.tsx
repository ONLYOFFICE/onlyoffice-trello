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

/* eslint-disable react/destructuring-assignment */
import React, {useState} from 'react';
import Select, {components} from 'react-select';
import {useTranslation} from 'react-i18next';

import {useStore} from 'root/context';

import {CheckIcon} from 'components/card-button/dropdown/CheckIcon';

import {SortBy, SortOrder} from 'components/card-button/types';
import {DropdownOption} from 'components/card-button/dropdown/types';

import './styles.css';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Menu(props: any): JSX.Element {
  const {t} = useTranslation();
  const store = useStore();
  const [selected, setSelected] = useState<SortOrder | undefined>(
    () => store.card.filters.sortOrder,
  );
  const handleSortOrder = (order: SortOrder): void => {
    store.card.filters.sortOrder = order;
    setSelected(order);
  };

  return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <components.Menu {...props}>
          <div>
              {/* eslint-disable-next-line */}
              <div>{props.children}</div>
              <hr style={{margin: 0}}/>
              <div>
                  <button
                      type='button'
                      onClick={() => handleSortOrder(SortOrder.Asc)}
                      className='onlyoffice_dropdown__button'
                  >
                      {t('onlyoffice.card.files.sort.asc')}
                      <div className='onlyoffice_dropdown__button_checksection'>
                          {selected === SortOrder.Asc && <CheckIcon/>}
                      </div>
                  </button>
                  <button
                      type='button'
                      onClick={() => handleSortOrder(SortOrder.Desc)}
                      className='onlyoffice_dropdown__button'
                  >
                      {t('onlyoffice.card.files.sort.desc')}
                      <div className='onlyoffice_dropdown__button_checksection'>
                          {selected === SortOrder.Desc && <CheckIcon/>}
                      </div>
                  </button>
              </div>
          </div>
      </components.Menu>
  );
}

export function Dropdown(): JSX.Element {
  const {t} = useTranslation();
  const store = useStore();
  const Options: DropdownOption[] = [
    {
      value: SortBy.Name,
      label: t('onlyoffice.files.sort.by.name'),
    },
    {
      value: SortBy.Size,
      label: t('onlyoffice.files.sort.by.size'),
    },
    {
      value: SortBy.Type,
      label: t('onlyoffice.files.sort.by.type'),
    },
    {
      value: SortBy.Modified,
      label: t('onlyoffice.files.sort.by.modified'),
    },
  ];
  const [selected, setSelected] = useState<DropdownOption | null>(() => {
    return Options.
      find((opt) => opt.value === store.card.filters.sortBy) || null;
  });

  const handleSortType = (type: DropdownOption | null): void => {
    setSelected(type);
    if (type?.value) {
      store.card.filters.sortBy = type.value as SortBy;
    }
  };

  return (
      <div style={{display: 'flex'}}>
          <Select
              placeholder={t('onlyoffice.card.files.sort.placeholder')}
              styles={{
                control: (css) => ({
                  ...css,
                  position: 'relative',
                  width: 'auto',
                  height: '45px',
                }),
                valueContainer: (css) => ({
                  ...css,
                  height: '45px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                }),
              }}
              closeMenuOnSelect={false}
              options={Options}
              defaultValue={selected}
              isSearchable={false}
              onChange={handleSortType}
              components={{Menu}}
          />
      </div>
  );
}

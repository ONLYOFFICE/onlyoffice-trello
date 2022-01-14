/* eslint-disable react/destructuring-assignment */
import React, {useState} from 'react';
import Select, {components} from 'react-select';

import {useStore} from 'root/context';
import {CheckIcon} from 'components/card-button/dropdown/CheckIcon';

import {SortBy, SortOrder} from 'components/card-button/types';
import {DropdownOption} from 'components/card-button/dropdown/types';

import './styles.css';

const Options: DropdownOption[] = [
  {
    value: SortBy.Name,
    label: SortBy.Name[0].toUpperCase() + SortBy.Name.slice(1),
  },
  {
    value: SortBy.Size,
    label: SortBy.Size[0].toUpperCase() + SortBy.Size.slice(1),
  },
  {
    value: SortBy.Type,
    label: SortBy.Type[0].toUpperCase() + SortBy.Type.slice(1),
  },
  {
    value: SortBy.Modified,
    label: SortBy.Modified[0].toUpperCase() + SortBy.Modified.slice(1),
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Menu(props: any): JSX.Element {
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
              <hr/>
              <div>
                  <button
                      type='button'
                      onClick={() => handleSortOrder(SortOrder.Asc)}
                      className='dropdown-button'
                  >
                      Ascending
                      <div className='dropdown-button_checksection'>
                          {selected === SortOrder.Asc && <CheckIcon/>}
                      </div>
                  </button>
                  <button
                      type='button'
                      onClick={() => handleSortOrder(SortOrder.Desc)}
                      className='dropdown-button'
                  >
                      Descending
                      <div className='dropdown-button_checksection'>
                          {selected === SortOrder.Desc && <CheckIcon/>}
                      </div>
                  </button>
              </div>
          </div>
      </components.Menu>
  );
}

export function Dropdown(): JSX.Element {
  const store = useStore();
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
              placeholder='Select'
              styles={{
                control: (css) => ({
                  ...css,
                  width: '10rem',
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

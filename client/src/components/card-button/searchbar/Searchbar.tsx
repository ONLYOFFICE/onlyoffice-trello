import React, {useCallback, useState} from 'react';

import {useStore} from 'root/context';

import search from 'public/images/search.svg';
import './styles.css';

export function Searchbar(): JSX.Element {
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
              placeholder='Search'
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

import React, {useState} from 'react';

import {useStore} from 'Root/context';

import search from 'Public/images/search.svg';
import './styles.css';

export const Searchbar = () => {
    const store = useStore();
    const [query, setQuery] = useState<string>('');
    const handleQuery = () => {
        store.card.filters.search = query;
    };
    return (
        <div id='searchbar_container'>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleQuery}
                id='searchbar_container__input'
                type='text'
                placeholder='Search'
            />
            <button
                id='searchbar_container__btn'
                type='submit'
                onClick={handleQuery}
            >
                <img src={search}/>
            </button>
        </div>
    );
};

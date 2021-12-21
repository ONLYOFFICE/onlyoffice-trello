import React, {useState} from 'react';
import Select, {components} from 'react-select';

import {useStore} from 'Root/context';
import {SORTBY, SORTORDER} from 'Types/enums';

import {CheckIcon} from './CheckIcon';

import './styles.css';

type Option = {
    value: string,
    label: string,
};

const Options: Option[] = [
    {value: 'name', label: 'Name'},
    {value: 'size', label: 'Size'},
    {value: 'type', label: 'Type'},
    {value: 'modified', label: 'Last Modified'},
];

const Menu = (props: any) => {
    const store = useStore();

    const [selected, setSelected] = useState<SORTORDER | undefined>(() => {
        return store.card.filters.sortOrder;
    });

    const handleSortOrder = (order: SORTORDER) => {
        store.card.filters.sortOrder = order;
        setSelected(order);
    };

    return (
        <>
            <components.Menu {...props}>
                <div>
                    <div>{props.children}</div>
                    <hr/>
                    <div>
                        <button
                            onClick={() => handleSortOrder(SORTORDER.ASC)}
                            className='dropdown-button'
                        >
                            {'Ascending'}
                            <div className='dropdown-button_checksection'>
                                {selected == SORTORDER.ASC && <CheckIcon/>}
                            </div>
                        </button>
                        <button
                            onClick={() => handleSortOrder(SORTORDER.DESC)}
                            className='dropdown-button'
                        >
                            {'Descending'}
                            <div className='dropdown-button_checksection'>
                                {selected == SORTORDER.DESC && <CheckIcon/>}
                            </div>
                        </button>
                    </div>
                </div>
            </components.Menu>
        </>
    );
};

export const Dropdown = () => {
    const store = useStore();

    const [selected, setSelected] = useState<Option | null>(() => {
        return Options.find((opt) => opt.value === store.card.filters.sortBy) || null;
    });

    const handleSortType = (type: Option | null) => {
        setSelected(type);
        if (type?.value) {
            store.card.filters.sortBy = type.value as SORTBY;
        }
    };

    return (
        <div style={{display: 'flex'}}>
            <Select
                placeholder={'Select'}
                styles={{
                    control: (css) => {
                        return {
                            ...css,
                            width: '10rem',
                        };
                    },
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
};

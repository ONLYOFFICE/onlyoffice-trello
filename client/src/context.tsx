import React, {useContext, createContext, FC} from 'react';
import {makeAutoObservable} from 'mobx';
import {configure} from 'mobx';

import {Trello} from 'Types/trello';
import {SORTBY, SORTORDER} from 'Types/enums';

configure({
    enforceActions: 'never',
});

class TrelloStore {
    private _trello: Trello.PowerUp.IFrame | null = null;
    card: {
        id?: string,
        filters: {
            search?: string;
            sortBy?: SORTBY;
            sortOrder?: SORTORDER;
        },
    } = {
        filters: {},
    }

    constructor() {
        makeAutoObservable(this);
    }

    public get trello(): Trello.PowerUp.IFrame {
        if (!this._trello) {
            this._trello = window.TrelloPowerUp.iframe({
                appName: process.env.POWERUP_NAME,
                appKey: process.env.POWERUP_APP_KEY,
            });
        }
        return this._trello;
    }
}

const TrelloContext = createContext<TrelloStore>(new TrelloStore());

const TrelloProvider: FC<{ store: TrelloStore }> = ({store, children}) => {
    return (
        <TrelloContext.Provider value={store}>{children}</TrelloContext.Provider>
    );
};

const useStore = () => {
    return useContext(TrelloContext);
};

export {TrelloStore, useStore, TrelloProvider};

/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {useContext, createContext} from 'react';
import {makeAutoObservable, configure} from 'mobx';

import {SortBy, SortOrder} from 'components/card-button/types';

configure({
  enforceActions: 'never',
});

class GlobalStore {
    card: {
        id?: string,
        filters: {
            search?: string;
            sortBy?: SortBy;
            sortOrder?: SortOrder;
        },
    } = {
      filters: {},
    }

    constructor() {
      makeAutoObservable(this);
    }
}

const GlobalStoreContext = createContext<GlobalStore>(new GlobalStore());

function GlobalStoreProvider(
  {store, children}: {store: GlobalStore, children: React.ReactNode},
): JSX.Element {
  return (
      <GlobalStoreContext.Provider value={store}>
          {children}
      </GlobalStoreContext.Provider>
  );
}

const useStore = (): GlobalStore => useContext(GlobalStoreContext);

export {GlobalStore, useStore, GlobalStoreProvider};

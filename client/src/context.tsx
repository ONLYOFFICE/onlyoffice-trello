import React, { useContext, createContext, FC } from 'react';
import { makeAutoObservable } from 'mobx';

import { Trello } from 'Types/trello';
import { SORTBY, SORTORDER } from 'Types/enums';

class TrelloStore {
  card: {
    id?: string,
    filters: {
      search?: string;
      sortBy?: SORTBY;
      sortOrder?: SORTORDER;
    },
    editorTokenJwt?: string,
    editorPayloadJwt?: string,
    editorConfigJwt?: string,
  } = {
    filters: {},
  }

  constructor() {
    makeAutoObservable(this);
  }

  public get trello(): Trello.PowerUp.IFrame {
    return window.TrelloPowerUp.iframe({
      appName: process.env.POWERUP_NAME,
      appKey: process.env.POWERUP_APP_KEY,
    });
  }
}

const TrelloContext = createContext<TrelloStore>(new TrelloStore());

const TrelloProvider: FC<{ store: TrelloStore }> = ({ store, children }) => {
  return (
    <TrelloContext.Provider value={store}>{children}</TrelloContext.Provider>
  );
};

const useStore = () => {
  return useContext(TrelloContext);
};

export { TrelloStore, useStore, TrelloProvider };

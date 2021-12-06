import React, { useContext, createContext, FC } from "react";
import { makeAutoObservable } from "mobx";
import { Trello } from "Types/trello";

class TrelloStore {
  authorization: string = "";
  activeCard: string = "";
  filters: {
    search?: string;
    sortBy?: "name" | "size" | "type" | "modified";
    sortOrder?: 'ASC' | 'DESC';
  } = {};
  onlyofficeSettings: {
    ds: string;
    secret: string;
    header: string;
  } = {
    ds: "",
    secret: "",
    header: "Authorization",
  };
  editorTokenJwt: string = "";
  editorPayloadJwt: string = "";
  editorConfigJwt: string = "";

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

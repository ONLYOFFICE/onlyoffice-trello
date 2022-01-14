import {trello} from 'root/api/client';
import {DocServerInfo} from 'components/card-button/types';
import {SettingsHandler} from 'root/api/types';
import {TrelloSettings} from 'types/trello';

export const trelloSettingsHandler = ():
  SettingsHandler => ({
  get: async (type: TrelloSettings): Promise<string> => {
    return trello.get('board', 'shared', type);
  },
  getPrivate: async (type: TrelloSettings): Promise<string> => {
    return trello.get('board', 'private', type);
  },
  set: async (type: TrelloSettings, value: string) => {
    await trello.set('board', 'shared', type, value);
  },
  setPrivate: async (type: TrelloSettings, value: string) => {
    await trello.set('board', 'private', type, value);
  },
});

export const fetchDocsInfo = async (): Promise<DocServerInfo> => {
  return await trello.get('board', 'shared') as DocServerInfo;
};

/* eslint-disable no-unused-vars */

import {TrelloSettings} from 'types/trello';

export interface SettingsHandler {
    get: (type: TrelloSettings) => Promise<string>,
    getPrivate: (type: TrelloSettings) => Promise<string>,
    set: (type: TrelloSettings, value: string) => Promise<void>,
    setPrivate: (type: TrelloSettings, value: string) => Promise<void>,
}

import {Trello, TrelloSettings} from 'Types/trello';

export const trelloSettingsHandler = (trello: Trello.PowerUp.IFrame) => {
    return {
        get: async (type: TrelloSettings): Promise<string> => {
            return await trello.get('board', 'shared', type);
        },
        getAll: async () => {
            return await trello.get('board', 'shared');
        },
        set: async (type: TrelloSettings, value: string) => {
            await trello.set('board', 'shared', type, value);
        },
    };
};

import {docKeyCleanup} from 'root/api/handlers/documentKey';

import constants from 'root/utils/const';

import {Trello} from 'types/trello';
import {ActionProps} from 'types/power-up';

export function getCardButton(
  _t: Trello.PowerUp.IFrame,
  props: ActionProps,
): Trello.PowerUp.CardButton[] {
  return [
    {
      icon: props.baseUrl,
      text: 'ONLYOFFICE',
      condition: 'signedIn',
      callback: (t: Trello.PowerUp.IFrame) => t.modal({
        title: 'ONLYOFFICE',
        url: '/card-button',
        fullscreen: true,
        callback: async () => {
          const attachment = window.localStorage.
            getItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT);
          const attachmentKey = window.localStorage.
            getItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT_KEY);
          window.localStorage.
            removeItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT);
          window.localStorage.
            removeItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT_KEY);

          const storedKey = (await t.
            get('card', 'shared', attachment || '')) as string;

          if (attachmentKey === storedKey) {
            await t.alert({
              message: `Please do not close the tab.
                ONLYOFFICE is waiting for a cleanup command`,
              duration: 30,
              display: 'warning',
            });
            docKeyCleanup(t);
          }
        },
      }),
    },
    {
      icon: props.baseUrl,
      text: 'ONLYOFFICE Reset',
      condition: 'admin',
      callback: async (t: Trello.PowerUp.IFrame): Promise<void> => {
        const cardData = await t.get('card', 'shared') as [];
        await t.remove('card', 'shared', Object.keys(cardData));
      },
    },
  ];
}

/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable max-len */
import {Trello} from 'types/trello';
import {ActionProps} from 'types/power-up';
import constants from 'root/utils/const';

const docKeyCleanup = (t: Trello.PowerUp.IFrame): void => {
  window.localStorage.removeItem(constants.ONLYOFFICE_LOCAL_STORAGE_AFTER_EDITOR);
  const eventSource = new EventSource(constants.ONLYOFFICE_SSE_ENDPOINT);
  const displayKeyRemoved = async (): Promise<void> => {
    await t.alert({
      message: 'Document key has been successfully removed. You can close the browser now',
      display: 'success',
    });
  };
  const cleanup = async ({data}: {data: string}): Promise<void> => {
    await t.remove('card', 'shared', data);
    await displayKeyRemoved();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    clearTimeout(timeout);
  };
  const timeout = setTimeout(async () => {
    eventSource.removeEventListener('message', cleanup);
    eventSource.close();
    await displayKeyRemoved();
  }, 30000);
  eventSource.addEventListener('message', cleanup);
};

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
          const afterEditor = window.localStorage.getItem(constants.ONLYOFFICE_LOCAL_STORAGE_AFTER_EDITOR);
          if (afterEditor) {
            await t.alert({
              message: `Please do not close the tab.
              We are removing ONLYOFFICE document keys from your trello storage`,
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
      condition: 'edit',
      callback: async (t: Trello.PowerUp.IFrame): Promise<void> => {
        const cardData = await t.get('card', 'shared') as [];
        await t.remove('card', 'shared', Object.keys(cardData));
      },
    },
  ];
}

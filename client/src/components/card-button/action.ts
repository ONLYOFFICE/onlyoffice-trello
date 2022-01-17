/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable max-len */
import {Trello} from 'types/trello';
import {ActionProps} from 'types/power-up';
import constants from 'root/utils/const';

const docKeyCleanup = (t: Trello.PowerUp.IFrame): void => {
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
  };
  eventSource.addEventListener('message', cleanup);
  setTimeout(async () => {
    eventSource.removeEventListener('message', cleanup);
    eventSource.close();
    await displayKeyRemoved();
  }, 30000);
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
          await t.alert({
            message: `Please do not close your browser.
            We are removing ONLYOFFICE document keys from your trello storage`,
            duration: 30,
            display: 'warning',
          });
          docKeyCleanup(t);
        },
      }),
    },
  ];
}

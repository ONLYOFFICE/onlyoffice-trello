import {Trello} from 'types/trello';
import {ActionProps} from 'types/power-up';
import constants from 'root/utils/const';

const docKeyCleanup = (t: Trello.PowerUp.IFrame): void => {
  const eventSource = new EventSource(constants.ONLYOFFICE_SSE_ENDPOINT);
  const cleanup = ({data}: {data: string}): void => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    t.remove('card', 'shared', data);
  };
  eventSource.addEventListener('message', cleanup);
  setTimeout(() => {
    eventSource.removeEventListener('message', cleanup);
    eventSource.close();
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
        callback: () => {
          docKeyCleanup(t);
        },
      }),
    },
  ];
}

/* eslint-disable @typescript-eslint/no-misused-promises */
import constants from 'root/utils/const';

import {Trello} from 'types/trello';

export const docKeyCleanup = (t: Trello.PowerUp.IFrame): void => {
  const eventSource = new EventSource(constants.ONLYOFFICE_SSE_ENDPOINT);
  const displayKeyRemoved = async (): Promise<void> => {
    await t.alert({
      message: 'ONLYOFFICE has finished cleaning up the plugin storage',
      display: 'success',
    });
  };
  const cleanup = async ({data}: {data: string}): Promise<void> => {
    await t.remove('card', 'shared', data);
    eventSource.removeEventListener('message', cleanup);
    eventSource.close();
    await displayKeyRemoved();
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    clearTimeout(timeout);
  };
  eventSource.addEventListener('message', cleanup);
  const timeout = setTimeout(async () => {
    eventSource.removeEventListener('message', cleanup);
    eventSource.close();
    await displayKeyRemoved();
  }, 15000);
};

import {nanoid} from 'nanoid';

import {trello} from 'root/api/client';
import {delay} from 'root/utils/withTimeout';
import constants from 'root/utils/const';

const getEditableDocKey = async (attachment: string): Promise<string> => {
  let key = (await trello.get('card', 'shared', attachment)) as string;
  if (!key) {
    key = nanoid();
    await trello.set('card', 'shared', attachment, key);
  }
  await delay(100);
  key = (await trello.get('card', 'shared', attachment)) as string;

  return key;
};

export const generateDocKeySignature = async (
  attachment: string,
  editable: boolean,
): Promise<string> => {
  const key = editable ? await getEditableDocKey(attachment) : nanoid();
  window.localStorage.
    setItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT, attachment);
  window.localStorage.
    setItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT_KEY, key);
  const timestamp = Number(new Date()) + (2 * 60 * 1000);
  return trello.jwt({
    state: JSON.stringify({
      docKey: key,
      attachment,
      due: timestamp,
    }),
  });
};

export const generateSettingsSignature = async (): Promise<string> => {
  const timestamp = Number(new Date()) + (1 * 60 * 1000);
  return trello.jwt({
    state: JSON.stringify({
      due: timestamp,
    }),
  });
};

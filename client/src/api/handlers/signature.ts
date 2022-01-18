import {nanoid} from 'nanoid';

import {trello} from 'root/api/client';
import constants from 'root/utils/const';

type KeyInfo = {
  key: string,
  isNew: boolean,
};

const getEditableDocKey = async (attachment: string): Promise<KeyInfo> => {
  let keyInfo: KeyInfo;
  try {
    keyInfo = {
      key: (await trello.get('card', 'shared', attachment)) as string,
      isNew: false,
    };
  } catch {
    throw new Error('Could not get data from trello data store');
  }

  if (!keyInfo.key) {
    keyInfo = {
      key: nanoid(),
      isNew: true,
    };
  }

  try {
    await trello.set('card', 'shared', attachment, keyInfo.key);
  } catch {
    throw new Error('Could not set data to trello data store');
  }

  return keyInfo;
};

export const generateDocKeySignature = async (
  attachment: string,
  editable: boolean,
): Promise<string> => {
  let keyInfo: KeyInfo;
  try {
    keyInfo = editable ? await getEditableDocKey(attachment) : {
      key: nanoid(),
      isNew: false, // Local docKey
    };
  } catch {
    throw new Error('Could not generate a document key');
  }
  const timestamp = Number(new Date()) + (2 * 60 * 1000);
  try {
    const signature = await trello.jwt({
      state: JSON.stringify({
        docKey: keyInfo.key,
        attachment,
        due: timestamp,
      }),
    });
    window.localStorage.
      setItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT, attachment);
    window.localStorage.
      setItem(constants.ONLYOFFICE_LOCAL_STORAGE_ATTACHMENT_KEY, keyInfo.key);
    return signature;
  } catch {
    const storedKey = await
      trello.get('card', 'shared', attachment) as string || '';
    if (storedKey === keyInfo.key && keyInfo.isNew) {
      await trello.remove('card', 'shared', attachment);
    }
    throw new Error('Could not generate a new session signature');
  }
};

export const generateSettingsSignature = async (): Promise<string> => {
  const timestamp = Number(new Date()) + (1 * 60 * 1000);
  return trello.jwt({
    state: JSON.stringify({
      due: timestamp,
    }),
  });
};

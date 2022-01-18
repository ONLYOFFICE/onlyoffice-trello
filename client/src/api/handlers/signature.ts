import {trello} from 'root/api/client';
import constants from 'root/utils/const';

type KeyInfo = {
  key: string,
  isNew: boolean,
};

/**
 *
 * @param attachment
 * @returns
 */
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
      key: Number(new Date()).toString(),
      isNew: true,
    };
    try {
      await trello.set('card', 'shared', attachment, keyInfo.key);
    } catch {
      /* Remove the oldest docKey
        On PluginData length of 4096 characters exceeded and regenerate it */

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const allKeys = (await trello.getAll()).card.shared as [] || [];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      const entries = Object.entries(allKeys).
        sort(([, a], [, b]) => b - a);
      if (entries.length < 1) {
        throw new Error('Could not set data to trello data store');
      }
      await trello.remove('card', 'shared', entries[0][0]);
      await trello.set('card', 'shared', attachment, keyInfo.key);
    }
    const savedKey = await trello.get('card', 'shared', attachment) as string;

    /* Refetch in order to avoid conflicting sessions */
    if (savedKey && savedKey !== keyInfo.key) {
      keyInfo.key = savedKey;
      keyInfo.isNew = false;
    }
  }

  return keyInfo;
};

/**
 *
 * @param attachment
 * @param editable
 * @returns
 */
export const generateDocKeySignature = async (
  attachment: string,
  editable: boolean,
): Promise<string> => {
  let keyInfo: KeyInfo;
  try {
    keyInfo = editable ? await getEditableDocKey(attachment) : {
      key: Number(new Date()).toString(),
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

/**
 *
 * @returns
 */
export const generateSettingsSignature = async (): Promise<string> => {
  const timestamp = Number(new Date()) + (1 * 60 * 1000);
  return trello.jwt({
    state: JSON.stringify({
      due: timestamp,
    }),
  });
};

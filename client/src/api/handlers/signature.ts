import {nanoid} from 'nanoid';

import {trello} from 'root/api/client';

export const generateDocKeySignature = async (
  attachment: string,
): Promise<string> => {
  let key = (await trello.get('card', 'shared', attachment)) as string;
  if (!key) {
    key = nanoid();
    await trello.set('card', 'shared', attachment, key);
  }
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

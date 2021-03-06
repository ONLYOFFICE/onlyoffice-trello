/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import {trello} from 'root/api/client';

import constants from 'root/utils/const';
import {delay} from 'root/utils/withTimeout';

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
        sort(([, a], [, b]) => a - b);
      if (entries.length < 1) {
        throw new Error('Could not set data to trello data store');
      }
      await trello.remove('card', 'shared', entries[0][0]);
      await trello.set('card', 'shared', attachment, keyInfo.key);
    }

    await delay(2000);

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
  const timestamp = Number(new Date()) + (1 * 60 * 1000);
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

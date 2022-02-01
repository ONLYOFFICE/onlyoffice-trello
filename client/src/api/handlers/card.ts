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

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {trello} from 'root/api/client';
import {isExtensionSupported} from 'root/utils/file';
import {generateOAuthHeader} from 'root/utils/oauth';
import constants from 'root/utils/const';

import {Trello} from 'types/trello';
import {TrelloCard} from 'components/card-button/types';

export async function fetchSupportedFiles(
  cardID: string,
): Promise<Trello.PowerUp.Attachment[]> {
  const rest = trello.getRestApi() as any;
  const token = await rest.getToken() as string;
  const options = {
    method: 'GET',
    url: constants.TRELLO_API_CARD_ATTACHMENTS(cardID),
  };
  const auth = generateOAuthHeader(
    options,
    rest.appKey as string,
    rest.t.secret as string,
    token,
  );

  const resp = await fetch(options.url, {
    headers: {
      Authorization: auth.Authorization,
    },
  });

  const files = ((await resp.json()) as Trello.PowerUp.Attachment[]).filter(
    (file) => isExtensionSupported(file.name.split('.')[1]),
  );

  return files;
}

export async function getCurrentCard(): Promise<TrelloCard> {
  return await trello.card('id', 'attachments') as TrelloCard;
}

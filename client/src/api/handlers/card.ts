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

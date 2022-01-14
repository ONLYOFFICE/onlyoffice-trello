/* eslint-disable */
import {trello} from 'root/api/client';
import constants from 'root/utils/const';

const tokenInfo = {
  scope: 'read,write',
  expires: '30days',
};

export async function getAuth(): Promise<string> {
  const rest = trello.getRestApi() as any;
  let token = await rest.getToken();

  if (!token) {
    token = await rest.authorize(tokenInfo);
  }

  const res = await fetch(constants.TRELLO_API_ME(token));
  if (res.status != 200) {
    await rest.clearToken();
    token = await rest.authorize(tokenInfo);
  }

  if (!token) {
    throw new Error('Could not receive a valid token');
  }

  return token;
}

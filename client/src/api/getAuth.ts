import { Trello } from 'Types/trello';
import constants from 'Root/utils/const';

export async function getAuth(t: Trello.PowerUp.IFrame): Promise<string> {
  const rest = t.getRestApi() as any;
  let token = await rest.getToken();

  if (!token) {
    token = await rest.authorize({ scope: 'read,write' });
  }

  const res = await fetch(constants.TRELLO_API_ME(token));
  if (res.status != 200) {
    await rest.clearToken();
    token = await rest.authorize({ scope: 'read,write', expires: '30days' });
  }

  if (!token) throw new Error('Could not receive a valid token');

  return token;
}

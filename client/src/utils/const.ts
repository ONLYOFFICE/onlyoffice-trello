/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default Object.freeze({
  ONLYOFFICE_ACTIVE_SESSION: 'ONLYOFFICE_ACTIVE_ATTACHMENT',
  ONLYOFFICE_LOCAL_STORAGE_INFO_CLOSED: 'ONLYOFFICE_INFO_CLOSED',

  ONLYOFFICE_SSE_ENDPOINT: `${process.env.BACKEND_HOST!}/onlyoffice/events`,
  ONLYOFFICE_SETTINGS_ENDPOINT:
    `${process.env.BACKEND_HOST!}/onlyoffice/settings`,

  TRELLO_API: 'https://api.trello.com/1/',
  TRELLO_API_CARDS: 'https://api.trello.com/1/cards/',
  TRELLO_API_CARD(id: string): string {
    return this.TRELLO_API_CARDS + id;
  },
  TRELLO_API_CARD_ATTACHMENTS(id: string): string {
    return `${this.TRELLO_API_CARD(id)}/attachments`;
  },
  TRELLO_API_ME(token: string): string {
    return `${this.TRELLO_API}members/me`
     + `?key=${process.env.POWERUP_APP_KEY || ''}&token=${token}`;
  },
});

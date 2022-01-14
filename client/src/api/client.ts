/* eslint-disable @typescript-eslint/ban-ts-comment */
import {Trello} from 'types/trello';

// @ts-ignore
// eslint-disable-next-line
export const trello = TrelloPowerUp.iframe({
  appName: process.env.POWERUP_NAME,
  appKey: process.env.POWERUP_APP_KEY,
}) as Trello.PowerUp.IFrame;

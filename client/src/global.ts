/* eslint-disable */
import {getCardButton} from 'components/card-button/action';
import {getSettings} from 'components/settings/action';

import {Trello} from 'types/trello';
import {ActionProps} from 'types/power-up';

const actionProps: ActionProps = {
  baseUrl: window.location.href.replace(/\/$/, ''),
};

// @ts-ignore: Trello powerup initialization (power-up.min.js from their CDN)
TrelloPowerUp.initialize(
  {
    'card-buttons': (t: Trello.PowerUp.IFrame) => getCardButton(t, actionProps),
    'show-settings':
      (t: Trello.PowerUp.IFrame, options: any) => getSettings(t, options),
  },
  {
    appName: process.env.POWERUP_NAME,
    appKey: process.env.POWERUP_APP_KEY,
  },
);

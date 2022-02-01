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

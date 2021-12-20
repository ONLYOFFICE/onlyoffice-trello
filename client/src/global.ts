import {Trello} from 'Types/trello';
import {ActionProps} from 'Types/power-up';
import {getCardButton} from 'Components/card-button/action';
import {getSettings} from 'Components/settings/action';

const ACTION_PROPS: ActionProps = {
    baseUrl: window.location.href.replace(/\/$/, ''),
};

window.TrelloPowerUp.initialize(
    {
        'card-buttons': (t: Trello.PowerUp.IFrame) =>
            getCardButton(t, ACTION_PROPS),
        'show-settings': (t: Trello.PowerUp.IFrame, options: any) =>
            getSettings(t, options),
    },
    {
        appName: process.env.POWERUP_NAME,
        appKey: process.env.POWERUP_APP_KEY,
    },
);

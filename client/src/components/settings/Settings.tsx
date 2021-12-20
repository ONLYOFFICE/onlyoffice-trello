import React, {useEffect, useState} from 'react';

import {trelloSettingsHandler} from 'Root/api/settingsHandler';
import {useStore} from 'Root/context';

import './styles.css';

const Settings: React.FC = () => {
    const {trello} = useStore();
    const settingsHandler = trelloSettingsHandler(trello);
    const [address, setAddress] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [header, setHeader] = useState<string>('');
    useEffect(() => {
        trello.render(async () => {
            try {
                setAddress(await settingsHandler.get('docs_address'));
                setSecret(await settingsHandler.get('docs_jwt'));
                setHeader(await settingsHandler.get('docs_header'));
                await trello.sizeTo('#onlyoffice-settings');
            } catch {
                trello.alert({
                    message: 'Could not fetch ONLYOFFICE settings, try again later',
                    duration: 15,
                    display: 'error',
                });
            }
        });
    }, []);
    const handleSave = async () => {
        try {
            await settingsHandler.set('docs_address', address || '');
            await settingsHandler.set('docs_header', header || '');
            await settingsHandler.set('docs_jwt', secret || '');
            trello.alert({
                message: 'ONLYOFFICE settings have been saved',
                duration: 15,
                display: 'info',
            });
            trello.closePopup();
        } catch {
            trello.alert({
                message: 'Could not save ONLYOFFICE settings',
                duration: 15,
                display: 'error',
            });
        }
    };
    return (
        <div id='onlyoffice-settings'>
            <div>
                <p>{'Configure ONLYOFFICE'}</p>
                <p>{'Document Server Address'}</p>
                <input
                    type='text'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <p>{'JWT Secret'}</p>
                <input
                    type='text'
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                />
                <p>{'JWT Header'}</p>
                <input
                    type='text'
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                />
                <button onClick={handleSave}>{'Save'}</button>
            </div>
        </div>
    );
};

export default Settings;

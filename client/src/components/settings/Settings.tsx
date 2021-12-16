import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useStore } from 'Root/context';

import './styles.css';

const Settings: React.FC = observer(() => {
  const store = useStore();
  const [ds, setDs] = useState('');
  const [secret, setSecret] = useState('');
  const [header, setHeader] = useState('');
  useEffect(() => {
    store.trello.render(async function () {
      try {
        const value = await Promise.all([
          store.trello.get('board', 'shared', 'docs_address'),
          store.trello.get('board', 'shared', 'docs_jwt'),
          store.trello.get('board', 'shared', 'docs_header'),
        ]);
        setDs(value[0]);
        setSecret(value[1]);
        setHeader(value[2]);
        await store.trello.sizeTo('#onlyoffice-settings');
      } catch {
        store.trello.alert({
          message: 'Could not fetch ONLYOFFICE settings, try again later',
          duration: 15,
          display: 'error',
        });
      }
    });
  }, []);
  const handleSave = async () => {
    try {
      await Promise.all([
        store.trello.set(
          'board',
          'shared',
          'docs_address',
          ds,
        ),
        store.trello.set(
          'board',
          'shared',
          'docs_jwt',
          secret,
        ),
        store.trello.set(
          'board',
          'shared',
          'docs_header',
          header,
        ),
      ]);
      store.trello.alert({
        message: 'ONLYOFFICE settings have been saved',
        duration: 15,
        display: 'info',
      });
      store.trello.closePopup();
    } catch {
      store.trello.alert({
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
          value={ds}
          onChange={(e) => setDs(e.target.value)}
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
});

export default Settings;

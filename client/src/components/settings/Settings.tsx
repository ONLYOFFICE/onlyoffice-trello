import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';

import { useStore } from 'Root/context';

import './styles.css';

const Settings: React.FC = observer(() => {
  const store = useStore();
  useEffect(() => {
    store.trello.render(async function () {
      try {
        const value = await Promise.all([
          store.trello.get('board', 'shared', 'docs_address'),
          store.trello.get('board', 'shared', 'docs_jwt'),
          store.trello.get('board', 'shared', 'docs_header'),
        ]);
        runInAction(() => {
          store.onlyofficeSettings.ds =
            value[0] || 'https://<documentserver_host>:<documentserver:port>/';
          store.onlyofficeSettings.secret = value[1];
          store.onlyofficeSettings.header = value[2];
        });
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
          store.onlyofficeSettings.ds
        ),
        store.trello.set(
          'board',
          'shared',
          'docs_jwt',
          store.onlyofficeSettings.secret
        ),
        store.trello.set(
          'board',
          'shared',
          'docs_header',
          store.onlyofficeSettings.header
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
          value={store.onlyofficeSettings.ds}
          onChange={(e) =>
            runInAction(() => (store.onlyofficeSettings.ds = e.target.value))
          }
        />
        <p>{'JWT Secret'}</p>
        <input
          type='text'
          value={store.onlyofficeSettings.secret}
          onChange={(e) =>
            runInAction(
              () => (store.onlyofficeSettings.secret = e.target.value)
            )
          }
        />
        <p>{'JWT Header'}</p>
        <input
          type='text'
          value={store.onlyofficeSettings.header}
          onChange={(e) =>
            runInAction(
              () => (store.onlyofficeSettings.header = e.target.value)
            )
          }
        />
        <button onClick={handleSave}>{'Save'}</button>
      </div>
    </div>
  );
});

export default Settings;

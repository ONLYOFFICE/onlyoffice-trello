import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";
import { useStore } from "Root/context";
import "./styles.css";

const Settings: React.FC = observer(() => {
  const store = useStore();
  useEffect(() => {
    store.trello.render(async function () {
      try {
        const value = await Promise.all([
          store.trello.get("board", "shared", "docs_address"),
          store.trello.get("board", "shared", "docs_jwt"),
        ]);
        runInAction(() => {
          store.onlyofficeSettings.ds =
            value[0] || "http://<documentserver_host>:<documentserver:port>/";
          store.onlyofficeSettings.secret = value[1];
        })
        await store.trello.sizeTo("#inner-settings-panel");
      } catch {
        store.trello.alert({
          message: "🍉 Could not fetch ONLYOFFICE settings, try again later",
          duration: 15,
          display: "error",
        });
      }
    });
  }, []);
  const handleSave = async () => {
    try {
      await Promise.all([
        store.trello.set(
          "board",
          "shared",
          "docs_address",
          store.onlyofficeSettings.ds
        ),
        store.trello.set(
          "board",
          "shared",
          "docs_jwt",
          store.onlyofficeSettings.secret
        ),
      ]);
      store.trello.alert({
        message: "🍉 Saved fruit!",
        duration: 15,
        display: "info",
      });
      store.trello.closePopup();
    } catch {
      store.trello.alert({
        message: "🍉 Could not save ONLYOFFICE settings",
        duration: 15,
        display: "error",
      });
    }
  };
  return (
    <div id="inner-settings-panel">
      <div id="admin-settings">
        <p>Configure ONLYOFFICE</p>
        <p>Document Server Address</p>
        <input
          type="text"
          value={store.onlyofficeSettings.ds}
          onChange={(e) => (runInAction(() => store.onlyofficeSettings.ds = e.target.value))}
        />
        <p>JWT Secret</p>
        <input
          type="text"
          value={store.onlyofficeSettings.secret}
          onChange={(e) => (runInAction(() => store.onlyofficeSettings.secret = e.target.value))}
        />
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
});

export default Settings;

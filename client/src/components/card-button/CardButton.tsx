import React, { useState, useEffect } from "react";
import { useStore } from "Root/context";
import { Trello } from "Types/trello";
import { observer } from "mobx-react-lite";

import "./styles.css";
import { FileContainer } from "./file/File";
import { Header } from "./header/Header";
import { Info } from "./info/Info";
import { File } from "./file/File";
import { Main } from "./main/Main";

const CardButton = observer(() => {
  const [files, setFiles] = useState<Trello.PowerUp.Attachment[]>([]);
  const [isEditor, setIsEditor] = useState(false);
  const store = useStore();

  useEffect(() => {
    store.trello.get("board", "shared").then((res) => {
      store.onlyofficeSettings.secret = res["docs_jwt"] || "";
      store.onlyofficeSettings.ds = res["docs_address"];
    });

    const rest = store.trello.getRestApi() as any;
    rest.getToken().then((token: string) => {
      if (!token) {
        rest
          .authorize({ scope: "read,write" })
          .then((res: string) => {
            store.authorization = res;
          })
          .catch(() => {
            console.error("Authorization failed");
          });
      } else {
        store.authorization = token;
      }
    });

    store.trello.card("id", "attachments").then(async (card: any) => {
      store.activeCard = card.id;
      setFiles(card.attachments);
    });

    return () => {
      store.activeCard = "";
      store.editorConfigJwt = "";
      store.editorPayloadJwt = "";
      store.editorTokenJwt = "";
    };
  }, []);

  const handleDownload = async (attachment: string, filename: string) => {
    try {
      //TODO [types]: Add jwt method
      store.editorTokenJwt = await (store.trello as any).jwt({
        state: JSON.stringify({
          token: store.authorization,
          card: store.activeCard,
          attachment: attachment,
          filename: filename,
        }),
      });

      store.editorConfigJwt = await (store.trello as any).jwt({
        state: JSON.stringify({
          document: {
            fileType: filename.split(".")[1],
            title: filename,
          },
        }),
      });

      store.editorPayloadJwt = await (store.trello as any).jwt({
        state: JSON.stringify({
          ...store.onlyofficeSettings,
        }),
      });

      setIsEditor(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="container">
      {isEditor && store.authorization && store.onlyofficeSettings.ds ? (
        <iframe
          src={`${process.env.BACKEND_HOST}/onlyoffice/editor?token=${store.editorTokenJwt}&epayload=${store.editorPayloadJwt}&config=${store.editorConfigJwt}`}
          style={{
            display: "block",
            overflow: "auto",
            height: "100vh",
            width: "100vw",
            border: "none",
          }}
          name="iframeEditor"
          id="iframeEditor"
        />
      ) : (
        <>
          <Main>
            <Header />
            <Info />
            <FileContainer>
              {files.map((file) => {
                return <File key={file.id} file={file}/>
              })}
            </FileContainer>
          </Main>
          {/* {files.map((file) => {
            return (
              <div
                key={file.id}
                id={file.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <a href={file.url}>{file.name}</a>
                <button onClick={() => handleDownload(file.id, file.name)}>
                  Open in ONLYOFFICE
                </button>
              </div>
            );
          })} */}
        </>
      )}
    </div>
  );
});

export default CardButton;

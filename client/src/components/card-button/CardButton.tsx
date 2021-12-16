import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import JSEncrypt from 'jsencrypt';

import { Trello } from 'Types/trello';
import { DocServer } from 'Types/docserver';
import {
  ProxyPayloadResource,
  ProxyPayloadSecret,
  EditorPayload,
} from 'Types/payloads';
import { getAuth } from 'Root/api/getAuth';
import { useStore } from 'Root/context';
import { getComparator } from 'Root/utils/sort';
import { generateOAuthHeader } from 'Root/utils/oauth';
import constants from 'Root/utils/const';
import { FileContainer } from './file/File';
import { isExtensionSupported } from 'Root/utils/file';
import { Header } from './header/Header';
import { Info } from './info/Info';
import { File } from './file/File';
import { Main } from './main/Main';
import { Loader } from './loader/Loader';

import './styles.css';

const CardButton = observer(() => {
  const [files, setFiles] = useState<Trello.PowerUp.Attachment[]>([]);
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState('');
  const [docServerInfo, setDocServerInfo] = useState<DocServer>();
  const store = useStore();

  useEffect(() => {
    (async () => {
      const res = await store.trello.get('board', 'shared');
      setDocServerInfo(res);
      const rest = store.trello.getRestApi() as any;
      const card = await store.trello.card('id', 'attachments');
      store.card.id = card.id;
      const options = {
        method: 'GET',
        url: constants.TRELLO_API_CARD_ATTACHMENTS(card.id),
      };
      const token = await getAuth(store.trello);
      const auth = generateOAuthHeader(
        options,
        rest.appKey,
        rest.t.secret,
        token
      );

      const resp = await fetch(options.url, {
        headers: {
          Authorization: auth.Authorization,
        },
      });

      setToken(token);

      const attachments = await resp.json();

      setFiles(attachments);
      setIsLoading(false);
    })();

    return () => {
      store.card = { filters: {} };
    };
  }, []);

  const handleDownload = async (attachment: string, filename: string) => {
    try {
      const rest = store.trello.getRestApi() as any;
      const auth = generateOAuthHeader(
        {
          method: 'GET',
          url: `https://api.trello.com/1/cards/${store.card.id}/attachments/${attachment}/download/${filename}`,
        },
        rest.appKey,
        rest.t.secret,
        token
      );

      const timestamp = +new Date();

      const proxyResource: ProxyPayloadResource = {
        to: 'api.trello.com',
        path: `/1/cards/${store.card.id}/attachments/${attachment}/download/${filename}`,
        docs_header: docServerInfo?.docs_header || '',
      };

      const proxySecret: ProxyPayloadSecret = {
        auth_value: auth.Authorization,
        docs_jwt: docServerInfo?.docs_jwt || '',
      };

      const proxyKey = await (
        await fetch(
          'https://5eb5-2a01-540-23b9-3700-d015-827a-78c9-9e18.ngrok.io/key'
        )
      ).text();

      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(proxyKey);

      const encr = encodeURIComponent(
        encrypt.encrypt(JSON.stringify(proxySecret)).toString()
      );

      const payload: EditorPayload = {
        proxyResource: encodeURIComponent(btoa(JSON.stringify(proxyResource))),
        proxySecret: encr,
        attachment: attachment,
        card: store.card.id || '',
        filename: filename,
        token: token,
        ds: docServerInfo?.docs_address || '',
        dsheader: docServerInfo?.docs_header || '',
        dsjwt: docServerInfo?.docs_jwt || '',
      };

      const signature = await (store.trello as any).jwt({
        state: JSON.stringify({
          attachment: attachment,
          due: timestamp + 1.5 * 60 * 1000,
        }),
      });

      setIsEditor(true);

      (document.getElementById('onlyoffice-editor-form') as HTMLFormElement).action = `${process.env.BACKEND_HOST}/onlyoffice/editor?signature=${signature}`;
      (document.getElementById('onlyoffice-editor-payload') as HTMLInputElement).value = JSON.stringify(payload);
      (document.getElementById('onlyoffice-editor-form') as HTMLFormElement).submit();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id='container'>
      {isEditor && token && docServerInfo?.docs_address ? (
        <>
          <form
            action=''
            method='POST'
            target='iframeEditor'
            id='onlyoffice-editor-form'
          >
            <input
              id='onlyoffice-editor-payload'
              name='payload'
              value=''
              type='hidden'
            />
          </form>
          <iframe name='iframeEditor' id='iframeEditor' />
        </>
      ) : (
        <>
          <Main>
            <Header />
            <Info />
            {!isLoading ? (
              <FileContainer>
                {store.card.filters?.sortBy && store.card.filters?.sortOrder ? (
                  <>
                    {files
                      .sort(
                        getComparator(store.card.filters.sortBy)?.(
                          store.card.filters.sortOrder
                        )
                      )
                      .map((file) => {
                        if (!isExtensionSupported(file.name.split('.')[1]))
                          return null;
                        if (
                          store.card.filters?.search &&
                          !file.name.includes(store.card.filters.search)
                        )
                          return null;
                        return (
                          <File
                            key={file.id}
                            handleDownload={handleDownload}
                            file={file}
                          />
                        );
                      })}
                  </>
                ) : (
                  <>
                    {files.map((file) => {
                      if (!isExtensionSupported(file.name.split('.')[1]))
                        return null;
                      if (
                        store.card.filters?.search &&
                        !file.name.includes(store.card.filters.search)
                      )
                        return null;
                      return (
                        <File
                          key={file.id}
                          handleDownload={handleDownload}
                          file={file}
                        />
                      );
                    })}
                  </>
                )}
              </FileContainer>
            ) : (
              <div className='onlyoffice_loader-container'>
                <Loader />
              </div>
            )}
          </Main>
        </>
      )}
    </div>
  );
});

export default CardButton;

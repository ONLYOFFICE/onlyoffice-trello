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

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import Spinner from '@atlaskit/spinner';
import {useTranslation} from 'react-i18next';

import {fetchDocsInfo} from 'root/api/handlers/settings';
import {fetchSupportedFiles, getCurrentCard} from 'root/api/handlers/card';
import {getAuth} from 'root/api/handlers/auth';
import {useStore} from 'root/context';

import {Header} from 'components/card-button/header/Header';
import {Info} from 'components/card-button/info/Info';
import {Main} from 'components/card-button/main/Main';
import {FileList} from 'components/card-button/file/FileList';
import {Editor} from 'components/card-button/editor/Editor';
import {Error} from 'components/card-button/error/Error';
import {Dropdown} from 'components/card-button/dropdown/Dropdown';

import {filterFiles} from 'root/utils/sort';

import {Trello} from 'types/trello';
import {
  ProxyPayloadResource,
  EditorPayload,
  DocServerInfo,
  TrelloCard,
} from 'components/card-button/types';

import './styles.css';

const CardButton = observer(() => {
  const {t, i18n} = useTranslation();
  const store = useStore();
  const [isEditor, setIsEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [token, setToken] = useState('');
  const [currentCard, setCurrentCard] = useState<TrelloCard>();
  const [files, setFiles] = useState<Trello.PowerUp.Attachment[]>([]);
  const [docServerInfo, setDocServerInfo] = useState<DocServerInfo>();
  const [editorPayload, setEditorPayload] = useState<EditorPayload>();

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        await i18n.changeLanguage(window.locale);
        setToken(await getAuth());
        setDocServerInfo(await fetchDocsInfo());
        const card = await getCurrentCard();
        setCurrentCard(card);
        setFiles(await fetchSupportedFiles(card.id));
        setIsLoading(false);
      } catch {
        setIsError(true);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [i18n]);

  const startEditor = (attachment: string, filename: string)
    : void => {
    if (!isError) {
      const resource: ProxyPayloadResource = {
        to: 'api.trello.com',
        path: `/1/cards/${currentCard!.id}/attachments/${attachment}/download/${encodeURIComponent(filename)}`,
        docsHeader: docServerInfo!.docsHeader,
      };
      try {
        setEditorPayload({
          proxyResource: btoa(
            unescape(encodeURIComponent((JSON.stringify(resource)))),
          ),
          attachment,
          card: currentCard!.id,
          filename,
          token,
          ds: docServerInfo!.docsAddress,
          dsheader: docServerInfo!.docsHeader,
          dsjwt: docServerInfo!.docsJwt,
        });
        setIsEditor(true);
      } catch (e) {
        setIsError(true);
      }
    }
  };

  return (
      <>
          {isError && <Error/>}
          {!isError && (
          <>
              {isEditor && (
              <Editor
                  payload={editorPayload!}
                  setError={setIsError}
              />
              )}
              {isLoading && (
                  <div className='onlyoffice_loader-container'>
                      <Spinner size='xlarge'/>
                  </div>
              )}
              {!isEditor && !isLoading && (
              <Main>
                  <Header/>
                  <Info/>
                  <div className='file_header'>
                      <h2>{t('onlyoffice.card.files.header')}</h2>
                      <div>
                          <Dropdown/>
                      </div>
                  </div>
                  <FileList
                      files={filterFiles(files, store.card.filters)}
                      openHandler={startEditor}
                  />
              </Main>
              )}
          </>
          )}
      </>
  );
});

export default CardButton;

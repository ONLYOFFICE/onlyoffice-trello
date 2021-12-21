import React, {useState, useEffect} from 'react';
import {observer} from 'mobx-react-lite';

import {Trello} from 'Types/trello';
import {DocServer} from 'Types/docserver';
import {ProxyPayloadResource, EditorPayload} from 'Types/payloads';
import {getAuth} from 'Root/api/getAuth';
import {useStore} from 'Root/context';
import {generateOAuthHeader} from 'Root/utils/oauth';
import constants from 'Root/utils/const';
import {filterFiles} from 'Root/utils/sort';
import {isExtensionSupported} from 'Root/utils/file';

import {Header} from './header/Header';
import {Info} from './info/Info';
import {Main} from './main/Main';
import {Loader} from './loader/Loader';
import {FileList} from './file/FileList';
import {Editor} from './editor/Editor';

import './styles.css';

const CardButton = observer(() => {
    const store = useStore();
    const [files, setFiles] = useState<Trello.PowerUp.Attachment[]>([]);
    const [isEditor, setIsEditor] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [token, setToken] = useState('');
    const [docServerInfo, setDocServerInfo] = useState<DocServer>();
    const [signature, setSignature] = useState('');
    const [editorPayload, setEditorPayload] = useState<EditorPayload>();

    useEffect(() => {
        (async () => {
            setDocServerInfo(await store.trello.get('board', 'shared'));
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
                token,
            );

            const resp = await fetch(options.url, {
                headers: {
                    Authorization: auth.Authorization,
                },
            });

            const files = ((await resp.json()) as Trello.PowerUp.Attachment[]).filter(
                (file) => isExtensionSupported(file.name.split('.')[1]),
            );
            setToken(token);
            setFiles(files);
            setIsLoading(false);
        })();

        return () => {
            store.card = {filters: {}};
        };
    }, []);

    const handleDownload = async (attachment: string, filename: string) => {
        try {
            const timestamp = Number(new Date());

            const proxyResource: ProxyPayloadResource = {
                to: 'api.trello.com',
                path: `/1/cards/${store.card.id}/attachments/${attachment}/download/${filename}`,
                docs_header: docServerInfo?.docs_header || '',
            };

            setEditorPayload({
                proxyResource: encodeURIComponent(btoa(JSON.stringify(proxyResource))),
                attachment,
                card: store.card.id || '',
                filename,
                token,
                ds: docServerInfo?.docs_address || '',
                dsheader: docServerInfo?.docs_header || '',
                dsjwt: docServerInfo?.docs_jwt || '',
            });
            setSignature(await (store.trello as any).jwt({
                state: JSON.stringify({
                    attachment,
                    due: timestamp + 1.5 * 60 * 1000,
                }),
            }));
            setIsEditor(true);
        } catch (err) {
            setIsError(true);
        }
    };

    const allowEditor = isEditor && token && docServerInfo?.docs_address;

    return (
        <div id='container'>
            {isError && (
                <div>Error</div>
            )}
            {!isError && (
                <>
                    {allowEditor ? (
                        <Editor
                            signature={signature}
                            payload={editorPayload!}
                            setError={setIsError}
                        />
                    ) : (
                        <>
                            <Main>
                                <Header/>
                                <Info/>
                                {isLoading && (
                                    <div className='onlyoffice_loader-container'>
                                        <Loader/>
                                    </div>
                                )}
                                {!isLoading && (
                                    <FileList
                                        files={filterFiles(files, store.card.filters)}
                                        handleDownload={handleDownload}
                                    />
                                )}
                            </Main>
                        </>
                    )}
                </>
            )}
        </div>
    );
});

export default CardButton;

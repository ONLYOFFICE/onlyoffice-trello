import React, {useEffect} from 'react';

import {EditorPayload} from 'Types/payloads';

import './styles.css';

export const Editor: React.FC<{signature: string, payload: EditorPayload, setError: React.Dispatch<React.SetStateAction<boolean>>}> = ({signature, payload, setError}) => {
    useEffect(() => {
        const form = (document.getElementById('onlyoffice-editor-form') as HTMLFormElement);
        form.action = `${process.env.BACKEND_HOST}/onlyoffice/editor?signature=${signature}`;
        (document.getElementById('onlyoffice-editor-payload') as HTMLInputElement).value = JSON.stringify(payload);
        form.submit();
        setTimeout(() => {
            if (!(document.getElementById('iframeEditor') as HTMLIFrameElement).contentWindow?.length) {
                setError(true);
            }
        }, 8000);
    }, []);

    const editorLoaded = () => {
        const isDocument = Boolean((document.getElementById('iframeEditor') as HTMLIFrameElement).contentWindow?.length);
        if (!isDocument) {
            setError(true);
        }
    };

    return (
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
            <iframe
                name='iframeEditor'
                id='iframeEditor'
                onLoad={editorLoaded}
            />
        </>
    );
};

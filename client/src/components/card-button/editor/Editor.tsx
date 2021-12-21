import React, {useEffect} from 'react';

import {EditorPayload} from 'Types/payloads';

import './styles.css';

const invokeEditor = (signature: string, payload: EditorPayload) => {
    (document.getElementById('onlyoffice-editor-form') as HTMLFormElement).
        action = `${process.env.BACKEND_HOST}/onlyoffice/editor?signature=${signature}`;
    (document.getElementById('onlyoffice-editor-payload') as HTMLInputElement).
        value = JSON.stringify(payload);
    (document.getElementById('onlyoffice-editor-form') as HTMLFormElement).submit();
};

export const Editor: React.FC<{signature: string, payload: EditorPayload, setError: React.Dispatch<React.SetStateAction<boolean>>}> = ({signature, payload, setError}) => {
    useEffect(() => {
        invokeEditor(signature, payload);
        setTimeout(() => {
            if (!(document.getElementById('iframeEditor') as HTMLIFrameElement).contentWindow?.length) {
                setError(true);
            }
        }, 8000);
    }, []);

    const editorLoaded = () => {
        const isDocument = !!(document.getElementById('iframeEditor') as HTMLIFrameElement).contentWindow?.length;
        if (!isDocument) props.setError(true);
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

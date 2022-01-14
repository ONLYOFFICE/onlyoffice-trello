/* eslint-disable max-len */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, {useEffect} from 'react';

import {EditorPayload} from 'components/card-button/types';

import './styles.css';

export function Editor({signature, payload, setError}: {
  signature: string,
  payload: EditorPayload,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
}): JSX.Element {
  const checkEditorLoaded = (): void => {
    const isDocument = Boolean((document.getElementById('iframeEditor') as HTMLIFrameElement)?.contentWindow?.length);
    if (!isDocument) {
      setError(true);
    }
  };

  useEffect(() => {
    const form = (document.getElementById('onlyoffice-editor-form') as HTMLFormElement);
    form.action = `${process.env.BACKEND_HOST!}/onlyoffice/editor?signature=${signature}`;
    (document.getElementById('onlyoffice-editor-payload') as HTMLInputElement).value = JSON.stringify(payload);
    form.submit();
    setTimeout(() => {
      checkEditorLoaded();
    }, 8000);
  }, []);

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
              onLoad={checkEditorLoaded}
          />
      </>
  );
}

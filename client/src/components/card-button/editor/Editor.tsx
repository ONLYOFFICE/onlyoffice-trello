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

/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, {useEffect, useRef} from 'react';
import Spinner from '@atlaskit/spinner';

import {generateDocKeySignature} from 'root/api/handlers/signature';
import {trello} from 'root/api/client';

import {getFileExt, isFileEditable} from 'root/utils/file';

import {EditorPayload} from 'components/card-button/types';

import './styles.css';

const cleanup = (id: string): void => {
  trello.remove('card', 'shared', id);
};

const isEditorLoaded = (): boolean => {
  return Boolean((document.getElementById('iframeEditor') as HTMLIFrameElement)?.
    contentWindow?.length);
};

const reactOnEvent = (e: MessageEvent<{action: string, id: string}>): void => {
  const {data, isTrusted} = e;

  if (isTrusted && data.action === 'cleanup') {
    cleanup(data.id);
  }
};

export function Editor({payload, setError}: {
  payload: EditorPayload,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
}): JSX.Element {
  // A temporary workaround to catch the second (editor's) onLoad event
  const frameLoadCounter = useRef(0);
  const checkEditorLoaded = (): void => {
    if (frameLoadCounter.current === 1 && !isEditorLoaded()) {
      setError(true);
      cleanup(payload.attachment);
    }
    frameLoadCounter.current += 1;
  };

  const init = async (): Promise<void> => {
    const isEditable = isFileEditable(getFileExt(payload.filename));
    try {
      const signature = await generateDocKeySignature(payload.attachment, isEditable);
      const form = (document.getElementById('onlyoffice-editor-form') as HTMLFormElement);
      form.action = `${process.env.BACKEND_HOST!}/onlyoffice/editor?signature=${signature}`;
      (document.getElementById('onlyoffice-editor-payload') as HTMLInputElement).
        value = JSON.stringify(payload);
      form.submit();

      setTimeout(() => {
        if (!isEditorLoaded()) {
          setError(true);
        }
      }, 8000);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    init();

    window.addEventListener('message', reactOnEvent);
    return () => {
      window.removeEventListener('message', reactOnEvent);
    };
  });

  return (
      <div>
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
          <div className='onlyoffice_editor__loader-container'>
              <Spinner size='xlarge'/>
          </div>
          <iframe
              name='iframeEditor'
              id='iframeEditor'
              onLoad={checkEditorLoaded}
          />
      </div>
  );
}

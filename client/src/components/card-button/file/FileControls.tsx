import React from 'react';
import {useTranslation} from 'react-i18next';

import {Trello} from 'types/trello';
import {OpenHandler} from 'components/card-button/file/types';

import download from 'public/images/download.svg';
import './styles.css';

// TODO: Reafactoring
export function FileControls({file, openHandler, isInitialized} : {
  file: Trello.PowerUp.Attachment,
  openHandler: OpenHandler,
  isInitialized: boolean,
}): JSX.Element {
  const {t} = useTranslation();
  const limitOK = parseFloat((file.bytes / 1000000).toFixed(2)) <= 1.5;
  return (
      <div className='file_container_item__controls'>
          <button type='button'>
              <a
                  href={file.url}
                  download={true}
              >
                  <img
                      src={download as string}
                      alt='onlyoffice_download'
                  />
              </a>
          </button>
          <button
              type='button'
              style={limitOK ? {display: 'visible'} : {visibility: 'hidden'}}
              disabled={!isInitialized}
              onClick={() => openHandler(file.id, file.name)}
          >
              {t('onlyoffice.files.file.open')}
          </button>
      </div>
  );
}

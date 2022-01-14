import React, {useState, useEffect} from 'react';

import {MobileFile} from 'components/card-button/file/FileMobile';
import {DesktopFile} from 'components/card-button/file/FileDesktop';

import {Trello} from 'types/trello';
import {OpenHandler} from 'components/card-button/file/types';

import download from 'public/images/download.svg';
import './styles.css';

export function File({file, openHandler} : {
  file: Trello.PowerUp.Attachment,
  openHandler: OpenHandler,
}): JSX.Element {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 941);

  useEffect(() => {
    const onResize = (): void => {
      setIsMobile(window.innerWidth <= 941);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const limitOK = parseFloat((file.bytes / 1000000).toFixed(2)) <= 1.5;

  return (
      <div className='file_container_item'>
          {isMobile && <MobileFile file={file}/>}
          {!isMobile && <DesktopFile file={file}/>}
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
              {limitOK && (
              <button
                  type='button'
                  onClick={() => openHandler(file.id, file.name)}
              >
                  Open in ONLYOFFICE
              </button>
              )}
          </div>
      </div>
  );
}


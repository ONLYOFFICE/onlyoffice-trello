import React, { useState, useEffect } from 'react';
import dateFormat from 'dateformat';

import download from 'Public/images/download.svg';
import { getIconByExt } from 'Root/utils/file';
import { Dropdown } from 'Components/card-button/dropdown/Dropdown';
import { Trello } from 'Types/trello';

import './styles.css';

export const FileContainer: React.FC = ({ children }) => {
  return (
    <>
      <div className='file_header'>
        <h2>{'Files'}</h2>
        <div>
          <Dropdown />
        </div>
      </div>
      <div className='file_container'>{children}</div>
    </>
  );
};

const DesktopFile: React.FC<{ file: Trello.PowerUp.Attachment }> = ({ file }) => {
  const extIcon = getIconByExt(file.name.split('.')[1]);
  return (
    <>
      <div className='file_container_item__main' style={{ maxWidth: '50%' }}>
        <img src={extIcon} />
        <h2>{file.name}</h2>
      </div>
      <div style={{ display: 'flex', maxWidth: '40%', marginRight: '4rem' }}>
        <p
          className='file_container_item__main__text__item'
          style={{ marginRight: '4rem' }}
        >
          {(file.bytes / 1000000).toFixed(2)} MB
        </p>
        <p className='file_container_item__main__text__item file_container_item__main__text__item_long'>
          {dateFormat(file.date, 'dd/m/yy HH:MM')}
        </p>
      </div>
    </>
  );
};

const MobileFile: React.FC<{ file: Trello.PowerUp.Attachment }> = ({ file }) => {
  const extIcon = getIconByExt(file.name.split('.')[1]);
  return (
    <>
      <div className='file_container_item__main'>
        <img src={extIcon} />
        <div className='file_container_item__main_mobile'>
          <h2>{file.name}</h2>
          <div className='file_container_item__main__text'>
            <p className='file_container_item__main__text__item'>
              {(file.bytes / 1000000).toFixed(2)} MB
            </p>
            <p className='file_container_item__main__text__item file_container_item__main__text__item_long'>
              {dateFormat(file.date, 'dd/m/yy HH:MM')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export const File: React.FC<{
  file: Trello.PowerUp.Attachment;
  handleDownload: (attachment: string, filename: string) => Promise<void>;
}> = (props) => {
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth <= 941;
  });

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 941);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className='file_container_item'>
      {!isMobile ? (
        <DesktopFile file={props.file} />
      ) : (
        <MobileFile file={props.file} />
      )}
      <div className='file_container_item__controls'>
        <button>
          <a href={props.file.url} download>
            <img src={download} alt='onlyoffice_download' />
          </a>
        </button>
        {parseFloat((props.file.bytes / 1000000).toFixed(2)) <= 2.5 ? (
          <button
            onClick={() => props.handleDownload(props.file.id, props.file.name)}
          >
            {'Edit in ONLYOFFICE'}
          </button>
        ) : null}
      </div>
    </div>
  );
};

import React from 'react';
import dateFormat from 'dateformat';

import {Trello} from 'types/trello';

import {getIconByExt} from 'root/utils/file';

export function DesktopFile(
  {file}: { file: Trello.PowerUp.Attachment },
): JSX.Element {
  const extIcon = getIconByExt(file.name.split('.')[1]);
  const fileSize = (file.bytes / 1000000).toFixed(2);
  return (
      <>
          <div
              className='file_container_item__main'
              style={{maxWidth: '50%'}}
          >
              <img
                  alt={file.name}
                  src={extIcon}
              />
              <h2>{file.name}</h2>
          </div>
          <div style={{display: 'flex', maxWidth: '40%', marginRight: '4rem'}}>
              <p
                  className='file_container_item__main__text__item'
                  style={{marginRight: '4rem'}}
              >
                  {`${fileSize} MB`}
              </p>
              {/* eslint-disable-next-line max-len */}
              <p className='file_container_item__main__text__item file_container_item__main__text__item_long'>
                  {dateFormat(file.date, 'dd/m/yy HH:MM')}
              </p>
          </div>
      </>
  );
}

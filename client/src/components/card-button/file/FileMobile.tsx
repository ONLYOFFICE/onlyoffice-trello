import React from 'react';
import dateFormat from 'dateformat';

import {getIconByExt} from 'root/utils/file';
import {Trello} from 'types/trello';

export function MobileFile(
  {file}: {file: Trello.PowerUp.Attachment},
): JSX.Element {
  const extIcon = getIconByExt(file.name.split('.')[1]);
  const fileSize = (file.bytes / 1000000).toFixed(2);
  return (
      <div className='file_container_item__main'>
          <img
              alt={file.name}
              src={extIcon}
          />
          <div className='file_container_item__main_mobile'>
              <h2>{file.name}</h2>
              <div className='file_container_item__main__text'>
                  <p className='file_container_item__main__text__item'>
                      {`${fileSize} MB`}
                  </p>
                  {/* eslint-disable-next-line max-len */}
                  <p className='file_container_item__main__text__item file_container_item__main__text__item_long'>
                      {dateFormat(file.date, 'dd/m/yy HH:MM')}
                  </p>
              </div>
          </div>
      </div>
  );
}

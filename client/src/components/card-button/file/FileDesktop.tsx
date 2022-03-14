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

import React from 'react';
import dateFormat from 'dateformat';

import {Trello} from 'types/trello';

import {getIconByExt} from 'root/utils/file';

import {OpenHandler} from './types';

export function DesktopFile(
  {file, open}: { file: Trello.PowerUp.Attachment, open: OpenHandler },
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
              <h2 id='file_container_item__main__header'>
                  <div
                      role='button'
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          open(file.id, file.name);
                        }
                      }}
                      onClick={() => open(file.id, file.name)}
                  >
                      {file.name}
                  </div>
              </h2>
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

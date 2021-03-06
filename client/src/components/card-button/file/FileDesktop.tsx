/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
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
import {FileControls} from './FileControls';

// TODO: Reafactoring (use store)
export function DesktopFile(
  {file, open, isInitialized} :
  { file: Trello.PowerUp.Attachment, open: OpenHandler, isInitialized: boolean },
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
              <h2
                  id='file_container_item__main__header'
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && isInitialized) {
                      open(file.id, file.name);
                    }
                  }}
                  onClick={() => isInitialized && open(file.id, file.name)}
                  title={file.name}
              >
                  {file.name}
              </h2>
          </div>
          <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '50%',
                alignItems: 'center',
              }}
          >
              <p style={{margin: 0}}>
                  {`${fileSize} MB`}
              </p>
              <p style={{margin: 0}}>
                  {dateFormat(file.date, 'dd/m/yy HH:MM')}
              </p>
              <FileControls
                  file={file}
                  openHandler={open}
                  isInitialized={isInitialized}
              />
          </div>
      </>
  );
}

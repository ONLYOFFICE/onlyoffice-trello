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

import {File} from 'components/card-button/file/File';

import {Trello} from 'types/trello';
import {OpenHandler} from 'components/card-button/file/types';

import './styles.css';

const scroll = (): void => {
  // eslint-disable-next-line max-len
  setTimeout(() => document.getElementById('onlyoffice-file-container')?.scrollTo({
    top: 0,
    behavior: 'smooth',
  }), 400);
};

export function FileList({files, openHandler, isInitialized}: {
    files: Trello.PowerUp.Attachment[],
    openHandler: OpenHandler,
    isInitialized: boolean,
}): JSX.Element {
  scroll();
  return (
      <div
          className='file_container'
          id='onlyoffice-file-container'
      >
          {files.map((file) => (
              <File
                  key={file.id}
                  file={file}
                  openHandler={openHandler}
                  isInitialized={isInitialized}
              />
          ))}
      </div>
  );
}

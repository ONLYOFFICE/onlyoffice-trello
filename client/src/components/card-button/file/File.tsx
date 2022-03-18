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

import React, {useState, useEffect} from 'react';

import {MobileFile} from 'components/card-button/file/FileMobile';
import {DesktopFile} from 'components/card-button/file/FileDesktop';

import {Trello} from 'types/trello';
import {OpenHandler} from 'components/card-button/file/types';

import {FileControls} from './FileControls';
import './styles.css';

// TODO: Reafactoring (use store)
export function File({file, openHandler, isInitialized} : {
  file: Trello.PowerUp.Attachment,
  openHandler: OpenHandler,
  isInitialized: boolean,
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

  return (
      <div className='file_container_item'>
          {isMobile && (
              <>
                  <MobileFile
                      file={file}
                      open={openHandler}
                      isInitialized={isInitialized}
                  />
                  <FileControls
                      file={file}
                      openHandler={openHandler}
                      isInitialized={isInitialized}
                  />
              </>
          )}
          {!isMobile && (
          <DesktopFile
              file={file}
              open={openHandler}
              isInitialized={isInitialized}
          />
          )}
      </div>
  );
}


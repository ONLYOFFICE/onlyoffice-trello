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

import { Injectable } from '@nestjs/common';

import { Constants } from '@utils/const';

import { EditorPayload } from '@models/payload';

// TODO: External file
const ONLYOFFICE_CELL = 'cell';
const ONLYOFFICE_WORD = 'word';
const ONLYOFFICE_SLIDE = 'slide';

const EditExtensions = new Map([
  ['docx', ONLYOFFICE_WORD],
  ['xlsx', ONLYOFFICE_CELL],
  ['pptx', ONLYOFFICE_SLIDE],
]);

const AllowedExtensions = new Map([
  ['xls', ONLYOFFICE_CELL],
  ['xlsx', ONLYOFFICE_CELL],
  ['xlsm', ONLYOFFICE_CELL],
  ['xlt', ONLYOFFICE_CELL],
  ['xltx', ONLYOFFICE_CELL],
  ['xltm', ONLYOFFICE_CELL],
  ['ods', ONLYOFFICE_CELL],
  ['fods', ONLYOFFICE_CELL],
  ['ots', ONLYOFFICE_CELL],
  ['csv', ONLYOFFICE_CELL],
  ['pps', ONLYOFFICE_SLIDE],
  ['ppsx', ONLYOFFICE_SLIDE],
  ['ppsm', ONLYOFFICE_SLIDE],
  ['ppt', ONLYOFFICE_SLIDE],
  ['pptx', ONLYOFFICE_SLIDE],
  ['pptm', ONLYOFFICE_SLIDE],
  ['pot', ONLYOFFICE_SLIDE],
  ['potx', ONLYOFFICE_SLIDE],
  ['potm', ONLYOFFICE_SLIDE],
  ['odp', ONLYOFFICE_SLIDE],
  ['fodp', ONLYOFFICE_SLIDE],
  ['otp', ONLYOFFICE_SLIDE],
  ['pdf', ONLYOFFICE_WORD],
  ['doc', ONLYOFFICE_WORD],
  ['docx', ONLYOFFICE_WORD],
  ['docm', ONLYOFFICE_WORD],
  ['dot', ONLYOFFICE_WORD],
  ['dotx', ONLYOFFICE_WORD],
  ['dotm', ONLYOFFICE_WORD],
  ['odt', ONLYOFFICE_WORD],
  ['fodt', ONLYOFFICE_WORD],
  ['ott', ONLYOFFICE_WORD],
  ['rtf', ONLYOFFICE_WORD],
  ['txt', ONLYOFFICE_WORD],
  ['fb2', ONLYOFFICE_WORD],
  ['epub', ONLYOFFICE_WORD],
  ['djvu', ONLYOFFICE_WORD],
  ['xps', ONLYOFFICE_WORD],
  ['xml', ONLYOFFICE_WORD],
  ['html', ONLYOFFICE_WORD],
  ['htm', ONLYOFFICE_WORD],
  ['mht', ONLYOFFICE_WORD],
]);
//

/**
 * Performs operations related to file management (Trello side, ONLYOFFICE file utils)
 */
@Injectable()
export class FileUtils {
    private trelloApiVersion = '1';

    constructor(
        private readonly constants: Constants,
    ) {}

    /**
   *
   * @param payload An object with essential trello properties
   * (oauth token, card id, attachment id, filename)
   * @returns A url to download 'filename' from trello servers
   */
    public buildTrelloFileUrl(payload: EditorPayload) {
      return `${this.constants.URL_TRELLO_BASE}/${this.trelloApiVersion}/cards/${payload.card}/attachments/${payload.attachment}/download/${encodeURI(payload.filename)}`;
    }

    /**
   *
   * @param fileExt
   * @returns
   */
    public isExtensionSupported(fileExt: string): [boolean, boolean] {
      return [
        EditExtensions.has(fileExt) || AllowedExtensions.has(fileExt), EditExtensions.has(fileExt),
      ];
    }

    /**
     *
     * @param filename
     * @returns
     */
    public getFileExtension(filename: string): string {
      return filename.split('.')[1];
    }
}

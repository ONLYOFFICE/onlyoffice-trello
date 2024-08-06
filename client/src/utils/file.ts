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

import word from 'public/images/word.svg';
import cell from 'public/images/cell.svg';
import slide from 'public/images/slide.svg';
import docx from 'public/images/docx.svg';
import xlsx from 'public/images/xlsx.svg';
import pptx from 'public/images/pptx.svg';

type FileType = {
  type: string,
  icon: string,
}

const ONLYOFFICE_CELL = 'cell';
const ONLYOFFICE_WORD = 'word';
const ONLYOFFICE_SLIDE = 'slide';

const genericWord: FileType = {
  type: ONLYOFFICE_WORD,
  icon: word as string,
};

const genericCell: FileType = {
  type: ONLYOFFICE_CELL,
  icon: cell as string,
};

const genericSlide: FileType = {
  type: ONLYOFFICE_SLIDE,
  icon: slide as string,
};

const EditExtensions = new Map<string, FileType>([
  ['docx', {
    type: ONLYOFFICE_WORD,
    icon: docx as string,
  }],
  ['xlsx', {
    type: ONLYOFFICE_CELL,
    icon: xlsx as string,
  }],
  ['pptx', {
    type: ONLYOFFICE_SLIDE,
    icon: pptx as string,
  }],
]);

const AllowedExtensions = new Map<string, FileType>([
  ['xls', genericCell],
  ['xlsx', genericCell],
  ['xlsm', genericCell],
  ['xlt', genericCell],
  ['xltx', genericCell],
  ['xltm', genericCell],
  ['ods', genericCell],
  ['fods', genericCell],
  ['ots', genericCell],
  ['csv', genericCell],
  ['pps', genericSlide],
  ['ppsx', genericSlide],
  ['ppsm', genericSlide],
  ['ppt', genericSlide],
  ['pptx', genericSlide],
  ['pptm', genericSlide],
  ['pot', genericSlide],
  ['potx', genericSlide],
  ['potm', genericSlide],
  ['odp', genericSlide],
  ['fodp', genericSlide],
  ['otp', genericSlide],
  ['pdf', genericWord],
  ['doc', genericWord],
  ['docx', genericWord],
  ['docm', genericWord],
  ['dot', genericWord],
  ['dotx', genericWord],
  ['dotm', genericWord],
  ['odt', genericWord],
  ['fodt', genericWord],
  ['ott', genericWord],
  ['rtf', genericWord],
  ['txt', genericWord],
  ['fb2', genericWord],
  ['epub', genericWord],
  ['djvu', genericWord],
  ['xps', genericWord],
  ['xml', genericWord],
  ['html', genericWord],
  ['htm', genericWord],
  ['mht', genericWord],
]);

export function getFileTypeByExt(fileExt: string): string {
  return AllowedExtensions.get(fileExt)?.type || ONLYOFFICE_WORD;
}

export function isFileEditable(fileExt: string): boolean {
  return EditExtensions.has(fileExt);
}

export function getIconByExt(fileExt: string): string {
  const icon = EditExtensions.get(fileExt)?.icon
    || AllowedExtensions.get(fileExt)?.icon || word as string;

  return icon;
}

export function isExtensionSupported(fileExt: string, edit?: boolean): boolean {
  return edit ? EditExtensions.has(fileExt) : AllowedExtensions.has(fileExt);
}

export function getFileExt(filename: string): string {
  return filename.split('.').at(-1) || filename;
}

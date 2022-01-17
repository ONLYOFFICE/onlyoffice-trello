import word from 'public/images/word.svg';
import cell from 'public/images/cell.svg';
import slide from 'public/images/slide.svg';

import pdf from 'public/images/pdf.svg';
import odt from 'public/images/odt.svg';
import ott from 'public/images/ott.svg';
import txt from 'public/images/txt.svg';
import rtf from 'public/images/rtf.svg';
import fb2 from 'public/images/fb2.svg';
import epub from 'public/images/epub.svg';

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
  ['docx', genericWord],
  ['xlsx', genericCell],
  ['pptx', genericSlide],
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
  ['pdf', {
    type: ONLYOFFICE_WORD,
    icon: pdf as string,
  }],
  ['doc', genericWord],
  ['docx', genericWord],
  ['docm', genericWord],
  ['dot', genericWord],
  ['dotx', genericWord],
  ['dotm', genericWord],
  ['odt', {
    type: ONLYOFFICE_WORD,
    icon: odt as string,
  }],
  ['fodt', genericWord],
  ['ott', {
    type: ONLYOFFICE_WORD,
    icon: ott as string,
  }],
  ['rtf', {
    type: ONLYOFFICE_WORD,
    icon: rtf as string,
  }],
  ['txt', {
    type: ONLYOFFICE_WORD,
    icon: txt as string,
  }],
  ['fb2', {
    type: ONLYOFFICE_WORD,
    icon: fb2 as string,
  }],
  ['epub', {
    type: ONLYOFFICE_WORD,
    icon: epub as string,
  }],
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
  return filename.split('.')[1];
}

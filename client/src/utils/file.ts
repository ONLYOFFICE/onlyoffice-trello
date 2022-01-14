import word from 'public/images/word.svg';
import cell from 'public/images/cell.svg';
import slide from 'public/images/slide.svg';

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
]);

const ExtensionIcons = new Map([
  [ONLYOFFICE_WORD, word as string],
  [ONLYOFFICE_CELL, cell as string],
  [ONLYOFFICE_SLIDE, slide as string],
]);

export function getFileTypeByExt(fileExt: string): string {
  return AllowedExtensions.get(fileExt) || ONLYOFFICE_WORD;
}

export function getIconByExt(fileExt: string): string {
  const icon = ExtensionIcons.get(getFileTypeByExt(fileExt));
  return icon || word as string;
}

export function isExtensionSupported(fileExt: string, edit?: boolean): boolean {
  return edit ? EditExtensions.has(fileExt) : AllowedExtensions.has(fileExt);
}

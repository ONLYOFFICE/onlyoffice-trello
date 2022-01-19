/* eslint-disable max-len */
// TODO: Refactoring (currying)
import {SortBy, SortOrder} from 'components/card-button/types';
import {Trello} from 'types/trello';

import {getFileExt} from './file';

const sortNames = (
  order: SortOrder,
) => (
  f1: Trello.PowerUp.Attachment,
  f2: Trello.PowerUp.Attachment,
) => {
  if (f1.name < f2.name) {
    return order === SortOrder.Desc ? 1 : -1;
  }
  if (f1.name > f2.name) {
    return order === SortOrder.Desc ? -1 : 1;
  }
  return 0;
};

const sortTypes = (
  order: SortOrder,
) => (
  f1: Trello.PowerUp.Attachment,
  f2: Trello.PowerUp.Attachment,
) => {
  const typeO = getFileExt(f1.name);
  const typeT = getFileExt(f2.name);
  if (typeO < typeT) {
    return order === SortOrder.Desc ? 1 : -1;
  }
  if (typeO > typeT) {
    return order === SortOrder.Desc ? -1 : 1;
  }
  return 0;
};

const sortModified = (
  order: SortOrder,
) => (
  f1: Trello.PowerUp.Attachment,
  f2: Trello.PowerUp.Attachment,
) => {
  if (f1.date < f2.date) {
    return order === SortOrder.Desc ? 1 : -1;
  }
  if (f1.date > f2.date) {
    return order === SortOrder.Desc ? -1 : 1;
  }
  return 0;
};

const sortSize = (
  order: SortOrder,
) => (
  f1: Trello.PowerUp.Attachment,
  f2: Trello.PowerUp.Attachment,
) => {
  if (f1.bytes && f2.bytes) {
    if (f1.bytes < f2.bytes) {
      return order === SortOrder.Desc ? 1 : -1;
    }
    if (f1.bytes > f2.bytes) {
      return order === SortOrder.Desc ? -1 : 1;
    }
    return 0;
  }
  return 0;
};

const comparators = new Map([
  [SortBy.Name, sortNames],
  [SortBy.Type, sortTypes],
  [SortBy.Modified, sortModified],
  [SortBy.Size, sortSize],
]);

// eslint-disable-next-line no-unused-vars
export const getComparator = (type: SortBy): ((order: SortOrder) => (f1: Trello.PowerUp.Attachment, f2: Trello.PowerUp.Attachment) => 1 | -1 | 0) | undefined => comparators.get(type);

export const filterFiles = (files: Trello.PowerUp.Attachment[], filter: {
    search?: string;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
}): Trello.PowerUp.Attachment[] => {
  let filtered = files;
  if (filter.search) {
    filtered = files.filter((f) => f.name.includes(filter.search!));
  }
  if (filter.sortBy && filter.sortOrder) {
    filtered = filtered.sort(
            getComparator(filter.sortBy)!(filter.sortOrder),
    );
  }
  return filtered;
};

import { SORTBY, SORTORDER } from 'Types/enums';
import { Trello } from 'Types/trello';
import { getFileTypeByExt } from './file';

const sortNames = (
    order: SORTORDER
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
        if (f1.name < f2.name) return order === SORTORDER.DESC ? 1 : -1;
        if (f1.name > f2.name) return order === SORTORDER.DESC ? -1 : 1;
        return 0;
    }
};

const sortTypes = (
    order: SORTORDER
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
        const typeO = getFileTypeByExt(f1.name.split('.')[1]);
        const typeT = getFileTypeByExt(f2.name.split('.')[1]);
        if (typeO < typeT) return order === SORTORDER.DESC ? 1 : -1;
        if (typeO > typeT) return order === SORTORDER.DESC ? -1 : 1;
        return 0;
    }
};

const sortModified = (
    order: SORTORDER
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
        if (f1.date < f2.date) return order === SORTORDER.DESC ? 1 : -1;
        if (f1.date > f2.date) return order === SORTORDER.DESC ? -1 : 1;
        return 0;
    }
};

const sortSize = (
    order: SORTORDER
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
            if (f1.bytes && f2.bytes) {
                if (f1.bytes < f2.bytes) return order === SORTORDER.DESC ? 1 : -1;
                if (f1.bytes > f2.bytes) return order === SORTORDER.DESC ? -1 : 1;
                return 0;
            }
            return 0;
        }
}

const comparators = new Map([
    [SORTBY.NAME, sortNames],
    [SORTBY.TYPE, sortTypes],
    [SORTBY.MODIFIED, sortModified],
    [SORTBY.SIZE, sortSize],
]);

export const getComparator = (type: SORTBY) => {
    return comparators.get(type) || undefined;
}

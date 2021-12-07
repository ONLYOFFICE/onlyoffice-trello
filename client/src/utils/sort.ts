import { Trello } from "Types/trello";
import { getFileTypeByExt } from "./file";

// TODO: Curry
const sortNames = (
    order: 'ASC' | 'DESC'
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
        if (f1.name < f2.name) return order === 'DESC' ? 1 : -1;
        if (f1.name > f2.name) return order === 'DESC' ? -1 : 1;
        return 0;
    }
};

const sortTypes = (
    order: 'ASC' | 'DESC'
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
        const typeO = getFileTypeByExt(f1.name.split('.')[1]);
        const typeT = getFileTypeByExt(f2.name.split('.')[1]);
        if (typeO < typeT) return order === 'DESC' ? 1 : -1;
        if (typeO > typeT) return order === 'DESC' ? -1 : 1;
        return 0;
    }
};

const sortModified = (
    order: 'ASC' | 'DESC'
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
        if (f1.date < f2.date) return order === 'DESC' ? 1 : -1;
        if (f1.date > f2.date) return order === 'DESC' ? -1 : 1;
        return 0;
    }
};

const sortSize = (
    order: 'ASC' | 'DESC'
) => {
    return (f1: Trello.PowerUp.Attachment,
        f2: Trello.PowerUp.Attachment) => {
            if (f1.bytes && f2.bytes) {
                if (f1.bytes < f2.bytes) return order === 'DESC' ? 1 : -1;
                if (f1.bytes > f2.bytes) return order === 'DESC' ? -1 : 1;
                return 0;
            }
            return 0;
        }
}

const comparators = new Map([
    ['name', sortNames],
    ['type', sortTypes],
    ['modified', sortModified],
    ['size', sortSize],
]);

export const getComparator = (type: "name" | "size" | "type" | "modified") => {
    return comparators.get(type) || undefined;
}

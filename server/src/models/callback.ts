type Action = {
    type: number;
    userid: string;
};

export type Callback = {
    key: string;
    status: number;
    users: string[];
    actions: Action[];
    url?: string;
};

export type DocKeySession = {
    Address: string,
    Header: string,
    Secret: string,
    Attachment: string,
    File: string,
    Card: string,
};

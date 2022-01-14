/* eslint-disable no-unused-vars */
export type DocServerInfo = {
    docsAddress: string;
    docsHeader: string;
    docsJwt: string;
};

export type TrelloAttachment = {
    date: string,
    id: string,
    idMember: string,
    name: string,
    url: string,
    edgeColor: any,
    previews: any[],
};

export type TrelloCard = {
    id: string,
    attachments: TrelloAttachment[],
};

export enum SortOrder {
    Asc = 'asc',
    Desc = 'desc'
}

export enum SortBy {
    Name = 'name',
    Size = 'size',
    Type = 'type',
    Modified = 'modified',
}

export type EditorPayload = {
    proxyResource: string;
    proxySecret?: string;
    token: string;
    card: string;
    attachment: string;
    filename: string;
    ds: string;
    dsheader: string;
    dsjwt: string;
};

export type ProxyPayloadResource = {
    to: string;
    path: string;
    docsHeader: string;
};

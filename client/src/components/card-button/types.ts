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
    isWriteMember: boolean;
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

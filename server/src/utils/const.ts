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

/**
 *
 */
@Injectable()
export class Constants {
    public readonly URL_TRELLO_BASE: string = 'https://trello.com';

    public readonly URL_TRELLO_API_BASE: string = 'https://api.trello.com/1';

    public readonly PREFIX_DOC_KEY_CACHE: string = 'docKey_';

    public readonly HEADER_ONLYOFFICE_DOC_KEY = 'ONLYOFFICE_DOCUMENT_KEY';

    public readonly HEADER_ONLYOFFICE_ORG_ID = 'ONLYOFFICE_TRELLO_ORGANIZATION_ID';

    /**
     *
     * @param ds
     * @returns
     */
    getDocumentServerCommandUrl(ds: string): string {
      return `${ds}coauthoring/CommandService.ashx`;
    }
}

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

/* eslint-disable max-classes-per-file */
import { MinLength, IsDefined, IsNotEmpty } from 'class-validator';

export class EditorPayload {
    @MinLength(40)
    @IsDefined()
        proxyResource: string;

    proxySecret: string;

    @MinLength(32)
    @IsDefined()
        token: string;

    @MinLength(10)
    @IsDefined()
        card: string;

    @MinLength(10)
    @IsDefined()
        attachment: string;

    @MinLength(1)
    @IsDefined()
        filename: string;

    @IsDefined()
        ds: string;

    @IsDefined()
        dsheader: string;

    @IsDefined()
    @MinLength(4)
        dsjwt: string;

    isEditable?: boolean;

    fileExtension?: string;
}

export class EditorPayloadForm {
    @IsNotEmpty()
        payload: string;
}

export type ProxyPayloadSecret = {
    docsJwt: string;
    authValue: string;
    due: number;
};

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

import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { FileUtils } from '@utils/file';
import { OAuthUtil } from '@utils/oauth';

import { EditorPayload } from '@models/payload';

/**
 * Useful validators
 */
@Injectable()
export class ValidatorUtils {
  constructor(
        private readonly fileUtils: FileUtils,
        private readonly oauthUtil: OAuthUtil,
  ) {}

  /**
   * Validates onlyoffice document servers' urls (https://documentserverhost/)
   *
   * @param url preferably a document server's url
   * @returns validity flag
   */
  validURL(url: string): boolean {
    const pattern = new RegExp(
      '^(https:\\/\\/)' // only with https
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}\\/$)',
      'i',
    ); // fragment locator
    return Boolean(pattern.test(url));
  }

  /**
     *
     * @param payload
     */
  async validateEditorPayload(payload: EditorPayload): Promise<EditorPayload> {
    const validationErr = await validate(payload);
    if (validationErr.length > 0) {
      throw new Error('Invalid form payload');
    }

    if (!this.validURL(payload.ds)) {
      throw new Error('Invalid document server url');
    }

    const fileExt = this.fileUtils.getFileExtension(payload.filename);
    const [fileSupported, fileEditable] = this.fileUtils.isExtensionSupported(fileExt);
    if (!fileSupported) {
      throw new Error(`file type is not supported (extension: ${fileExt}`);
    }

    const validPayload: EditorPayload = {
      ...payload,
      isEditable: fileEditable,
      fileExtension: fileExt,
    };

    return validPayload;
  }

  /**
     *
     * @param fileUrl
     * @param token
     */
  async validateFileSize(fileUrl: string, token: string) {
    const header = this.oauthUtil.getAuthHeaderForRequest(
      {
        url: fileUrl,
        method: 'HEAD',
      },
      token,
    );

    const fileInfo = await axios.get(fileUrl, {
      headers: {
        Authorization: header.Authorization,
        Range: 'bytes=0-1',
      },
    });

    const contentRange = fileInfo.headers['content-range'];
    const contentLength = contentRange ? parseInt(contentRange.split('/')[1], 10) : null;

    const fileSize = contentLength / 1000000;
    if (fileSize > 1.6) {
      throw new Error(`file [${fileUrl}] size limit has been exceeded`);
    }
  }
}

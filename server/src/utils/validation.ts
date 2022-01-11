import axios from 'axios';
import {Injectable} from '@nestjs/common';
import {validate} from 'class-validator';

import { FileUtils } from './file';
import { OAuthUtil } from './oauth';

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
            '^(https:\\/\\/)' + // only with https
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}\\/$)',
            'i',
        ); // fragment locator
        return Boolean(pattern.test(url));
    }

    /**
     *
     * @param payload
     */
    async validateEditorPayload(payload: EditorPayload) {
        const validationErr = await validate(payload);
        if (validationErr.length > 0) {
            throw new Error('Invalid form payload');
        }

        if (!this.validURL(payload.ds)) {
            throw new Error('Invalid document server url');
        }

        const fileExt = payload.filename.split('.')[1];
        const [fileSupported, fileEditable] = this.fileUtils.isExtensionSupported(fileExt);
        if (!fileSupported) {
            throw new Error('File type is not supported');
        }

        payload.isEditable = fileEditable;
        payload.fileExtension = fileExt;
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

        const fileInfo = await axios.head(fileUrl, {
            headers: {
                Authorization: header.Authorization,
            },
        });

        const fileSize = parseFloat(fileInfo.headers['content-length']) / 1000000;
        if (fileSize > 1.6) {
            throw new Error('File size error');
        }
    }
}

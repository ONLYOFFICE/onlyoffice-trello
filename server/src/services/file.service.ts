import axios from 'axios';
import {
  createWriteStream,
  existsSync,
  readdir,
  rmSync,
  unlink,
  mkdirSync,
  promises,
  constants,
} from 'fs';
import { join, dirname } from 'path';

import { FilePayload } from '@models/payloads';
import { FileUtils } from '@utils/file';
import { OAuthUtil } from '@utils/oauth';
import { Injectable, Logger } from '@nestjs/common';

/**
 * A basic file manager (WIP)
 */
@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private serverRoot: string;

  constructor(private oauthUtils: OAuthUtil, private fileUtils: FileUtils) {
    (async () => {
      this.serverRoot = await this.getServerRoot();
      this.deleteFilestoreFolder();
    })();
  }

  /**
   * Downloads files from trello servers and saves them to the disk (filestore folder)
   *
   * @param info An object with trello's card id, attachment id, file name and oauth token to initiate dowload
   */
  public async upload(info: FilePayload) {
    this.logger.debug(
      'Trying to upload a new file from Trello to the Filestore',
    );
    const request = {
      url: this.fileUtils.buildTrelloFileUrl(info),
      method: 'GET',
    };
    const authHeader = this.oauthUtils.getAuthHeaderForRequest(
      request,
      info.token,
    );

    const fileDir = join(
      this.serverRoot,
      process.env.FILESTORE_FOLDER_NAME || 'filestore',
      info.attachment,
    );

    this.checkAndCreateDir(fileDir);

    const writableStream = createWriteStream(join(fileDir, info.filename));

    try {
      const response = await axios({
        url: request.url,
        method: 'GET',
        responseType: 'stream',
        headers: {
          Authorization: authHeader.Authorization,
        },
      });

      response.data?.pipe(writableStream);

      this.logger.debug('File has been successfully uploaded');
    } catch (err) {
      writableStream.close();
      throw new Error(err);
    }
  }

  /**
   * A wrapper over fs's existsSync function
   *
   * @param path Path to a particular file
   * @returns boolean flag
   */
  public checkPath(path: string): boolean {
    this.logger.debug('Trying to file an existing file');
    return existsSync(path);
  }

  /**
   * Checks an existing attachment
   * @param attachment unique trello id
   * @returns boolean flag
   */
  public checkAttachment(attachment: string): boolean {
    const fileDir = join(
      this.serverRoot,
      process.env.FILESTORE_FOLDER_NAME || 'filestore',
      attachment,
    );

    return existsSync(fileDir);
  }

  /**
   * Creates an empty directory if not already present
   *
   * @param path Path to the file storage (filestore)
   */
  private checkAndCreateDir(path: string) {
    this.logger.debug('Trying to create filestore directories');
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  }

  /**
   * Deletes a file/folders
   *
   * @param attachment Optional. If present tries to remove the attachment folder
   * @param filename Optional. If present tries to remove the file specified (appends to the aforementioned path parameter)
   * @returns
   */
  public deleteFilestoreFolder(attachment?: string, filename?: string) {
    const path = join(
      this.serverRoot,
      process.env.FILESTORE_FOLDER_NAME || 'filestore',
      attachment || '',
    );
    if (!filename) {
      if (existsSync(path)) rmSync(path, { recursive: true });
      return;
    }
    readdir(path, (_, files) => {
      if (files?.length === 1) {
        rmSync(path, { recursive: true });
      } else {
        const filePath = join(path, filename);
        if (existsSync(filePath)) {
          unlink(filePath, () => {});
        }
      }
    });
  }

  /**
   *
   * @returns Server root path
   */
  public async getServerRoot() {
    for (const p of module.paths) {
      try {
        const prospectivePkgJsonDir = dirname(p);
        await promises.access(p, constants.F_OK);
        return prospectivePkgJsonDir;
      } catch (e) {}
    }
    return join(__dirname, '..', '..');
  }
}

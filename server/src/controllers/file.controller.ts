import { Request, Response } from 'express';
import { Controller, Get, Logger, Req, Res } from '@nestjs/common';
import { join } from 'path';

import { FilePayload } from '@models/payloads';
import { FileService } from '@services/file.service';
import { Constants } from '@utils/const';

/**
 * FileController is responsible for exposing filestore interaction endpoints
 */
@Controller({ path: FileController.baseRoute })
export class FileController {
  private readonly logger = new Logger(FileController.name);
  public static readonly baseRoute = '/api/v1/filemanager';

  constructor(
    private fileService: FileService,
    private constants: Constants,
  ) {}

  @Get('upload')
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.debug('Trying to upload a new file');
      const payload = new FilePayload(
        req.header(this.constants.HEADER_TOKEN)!,
        req.header(this.constants.HEADER_CARD_ID)!,
        req.header(this.constants.HEADER_ATTACHMENT_ID)!,
        req.header(this.constants.HEADER_FILENAME)!,
      );
      await this.fileService.upload(payload);
      res.status(200).end();
    } catch (err) {
      this.logger.error(err);
      res.status(403).end();
    }
  }

  @Get('download')
  async downloadFile(@Req() req: Request, @Res() res: Response) {
    try {
      this.logger.debug('Trying to download a file');
      const rootDir = await this.fileService.getServerRoot();
      const attachment =
        req.headers[this.constants.HEADER_ATTACHMENT_ID]?.toString();
      const filename = req.headers[this.constants.HEADER_FILENAME]?.toString();

      const fileDir = join(rootDir, 'filestore', attachment, filename);

      if (!this.fileService.checkPath(fileDir))
        throw new Error("File doesn't exist");
      res.download(fileDir);
    } catch (err) {
      this.logger.error(err);
      res.status(403);
      res.send({ error: 1 }).end();
    }
  }
}

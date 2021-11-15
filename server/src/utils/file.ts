import { Injectable } from '@nestjs/common';
import { FilePayload } from '@models/payloads';
import { Constants } from './const';

/**
 * Performs operations related to file management (Trello side, Onlyoffice file utils)
 */
@Injectable()
export class FileUtils {
  private trelloApiVersion: string = '1';

  constructor(
    private readonly constants: Constants,
  ){};

  /**
   *
   * @param payload An object with essential trello properties (oauth token, card id, attachment id, filename)
   * @returns A url to download 'filename' from trello servers
   */
  public buildTrelloFileUrl(payload: FilePayload) {
    return `${this.constants.URL_TRELLO_BASE}/${this.trelloApiVersion}/cards/${payload.card}/attachments/${payload.attachment}/download/${payload.filename}`;
  }
}

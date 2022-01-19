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

    /**
     *
     * @param ds
     * @returns
     */
    getDocumentServerCommandUrl(ds: string): string {
      return `${ds}coauthoring/CommandService.ashx`;
    }
}

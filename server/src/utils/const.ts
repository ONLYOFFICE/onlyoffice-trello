import { Injectable } from '@nestjs/common';

@Injectable()
export class Constants {
  public readonly URL_TRELLO_BASE: string = 'https://trello.com';
  public readonly URL_TRELLO_API_BASE: string = 'https://api.trello.com/1';

  public readonly HEADER_RAW_JWT: string = 'ONLYOFFICE_RAW_JWT';
  public readonly HEADER_TOKEN: string = 'ONLYOFFICE_TOKEN';
  public readonly HEADER_CARD_ID: string = 'ONLYOFFICE_CARD';
  public readonly HEADER_ATTACHMENT_ID: string = 'ONLYOFFICE_ATTACHMENT';
  public readonly HEADER_FILENAME: string = 'ONLYOFFICE_FILENAME';
  public readonly HEADER_DOCSERVER_URL: string = 'ONLYOFFICE_DS';
  public readonly HEADER_DOCSERVER_SECRET: string = 'ONLYOFFICE_DS_SECRET';
  public readonly HEADER_DOCSERVER_HEADERNAME: string = 'ONLYOFFICE_DS_HEADER';

  public readonly PREFIX_DOWNLOAD_TOKEN_CACHE: string = 'download_token';
  public readonly PREFIX_DOC_KEY_CACHE: string = 'docKey';
  public readonly PREFIX_UPLOAD_CACHE: string = 'upload';

  public readonly SECURITY_INTERNAL_TOKENS_EXP: number = 30;
}

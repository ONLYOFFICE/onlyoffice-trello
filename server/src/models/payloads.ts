export class FilePayload {
  public readonly token: string;
  public readonly card: string;
  public readonly attachment: string;
  public readonly filename: string;
  constructor(
    token: string,
    card: string,
    attachment: string,
    filename: string,
  ) {
    if (!token || !card || !attachment || !filename)
      throw new Error('Invalid file upload payload constructor parameters');
    this.token = token;
    this.card = card;
    this.attachment = attachment;
    this.filename = filename;
  }
}

export class FilestorePayload {
  public readonly attachment: string;
  public readonly filename: string;
  constructor(attachment: string, filename: string) {
    if (!attachment || !filename)
      throw new Error('Invalid filestore payload parameters');
    this.attachment = attachment;
    this.filename = filename;
  }
}

export class EditorPayload {
  public readonly secret: string;
  public readonly ds: string;
  public readonly header: string;
  constructor(secret: string, ds: string, header: string) {
    if (!ds && !header) throw new Error('Invalid editor payload parameters');
    this.secret = secret || '';
    this.ds = ds;
    this.header = header;
  }
}

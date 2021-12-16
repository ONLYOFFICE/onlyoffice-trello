import { MinLength, IsDefined, IsNotEmpty } from 'class-validator';

export class EditorPayload {
  @MinLength(1)
  @IsDefined()
  proxyResource: string;
  @MinLength(1)
  @IsDefined()
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
}

export class EditorPayloadForm {
  @IsNotEmpty()
  payload: string;
}

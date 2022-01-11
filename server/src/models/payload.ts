import {MinLength, IsDefined, IsNotEmpty} from 'class-validator';

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
    docs_jwt: string;
    auth_value: string;
    due: number;
};

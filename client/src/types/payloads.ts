export type ProxyPayloadResource = {
    to: string;
    path: string;
    docs_header: string;
};

export type ProxyPayloadSecret = {
    docs_jwt: string;
    auth_value: string;
};

export type EditorPayload = {
    proxyResource: string;
    proxySecret?: string;
    token: string;
    card: string;
    attachment: string;
    filename: string;
    ds: string;
    dsheader: string;
    dsjwt: string;
};

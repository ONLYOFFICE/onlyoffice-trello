export type Config = {
    document: Document,
    editorConfig: EditorConfig,
    token?: string,
};

type Document = {
    fileType: string,
    key: string,
    title: string,
    url: string,
};

type EditorConfig = {
    callbackUrl: string,
    user: User,
    mode?: 'edit' | 'view'
};

type User = {
    id: string,
    name: string,
};

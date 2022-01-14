/* eslint-disable no-unused-vars */
export interface OpenHandler {
    (attachment: string, filename: string): Promise<void>,
}

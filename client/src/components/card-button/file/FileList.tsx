import React from 'react';
import {Trello} from 'Types/trello';
import {FileContainer, File} from 'Components/card-button/file/File';

export const FileList: React.FC<{
    files: Trello.PowerUp.Attachment[];
    handleDownload: (attachment: string, filename: string) => Promise<void>;
}> = ({files, handleDownload}) => {
    return (
        <FileContainer>
            {files.map((file) => {
                return (
                    <File
                        key={file.id}
                        handleDownload={handleDownload}
                        file={file}
                    />
                );
            })}
        </FileContainer>
    );
};

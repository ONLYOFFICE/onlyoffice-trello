import React from 'react';

import {File} from 'Components/card-button/file/File';
import {Dropdown} from 'Components/card-button/dropdown/Dropdown';

import {Trello} from 'Types/trello';

import './styles.css';

const scroll = () => {
    setTimeout(() => document.getElementById('onlyoffice-file-container')?.scrollTo({
        top: 0,
        behavior: 'smooth',
    }), 300);
};

export const FileList: React.FC<{
    files: Trello.PowerUp.Attachment[];
    handleDownload: (attachment: string, filename: string) => Promise<void>;
}> = ({files, handleDownload}) => {
    scroll();
    return (
        <>
            <div className='file_header'>
                <h2>{'Files'}</h2>
                <div>
                    <Dropdown/>
                </div>
            </div>
            <div
                className='file_container'
                id='onlyoffice-file-container'
            >
                {files.map((file) => {
                    return (
                        <File
                            key={file.id}
                            handleDownload={handleDownload}
                            file={file}
                        />
                    );
                })}
            </div>
        </>
    );
};

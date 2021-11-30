import React from 'react';
import './styles.css';
//TODO: Alias
import word from '../../../../public/images/word.svg';
import download from '../../../../public/images/download.svg';

export const FileContainer: React.FC = ({ children }) => {
    return (
        <div className='file_container'>
            <ul className='file_container-scroller'>
                {children}
            </ul>
        </div>
    )
}

export const File = () => {
    return (
        <div className='file_container_item'>
            <div className='file_container_item__main'>
                <img src={word}/>
                <h2>File.docx</h2>
            </div>
            <div className='file_container_item__size'>
                4.72kB
            </div>
            <div className='file_container_item__updated'>
                Updated 50 minutes ago
            </div>
            <div className='file_container_item__controls'>
                <button><img src={download} alt="onlyoffice_download" onClick={() => alert(1)} /></button>
                <button>Edit in ONLYOFFICE</button>
            </div>
        </div>
    )
}

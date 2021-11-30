import React from 'react';
import './styles.css';
import word from '../../../../public/images/word.svg';

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
                <button>d</button>
                <button>Edit in ONLYOFFICE</button>
            </div>
        </div>
    )
}

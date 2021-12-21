import React from 'react';

import './styles.css';

// TODO: Dynamic error component with props
export const Error: React.FC = () => {
    return (
        <div className='onlyoffice-error'>
            <p className='onlyoffice-error_header'>System error</p>
            <p className='onlyoffice-error_text'>Something went wrong. Perhaps, the service is busy or we don't have your access token. Please try again later or contant the site administrator</p>
            <div className='onlyoffice-error_background'/>
            <div className='onlyoffice-error_background'/>
            <div className='onlyoffice-error_background'/>
        </div>
    );
};

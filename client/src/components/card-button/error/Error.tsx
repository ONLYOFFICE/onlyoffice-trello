import React from 'react';

import './styles.css';

const genericError = `
    Something went wrong. Perhaps, the service is busy or there is
    something wrong with your settings.
    Please try again later or contant the site administrator
`;

export function Error(): JSX.Element {
  return (
      <div className='onlyoffice-error'>
          <p className='onlyoffice-error_header'>System error</p>
          <p className='onlyoffice-error_text'>
              {genericError}
          </p>
          <div className='onlyoffice-error_background'/>
          <div className='onlyoffice-error_background'/>
          <div className='onlyoffice-error_background'/>
      </div>
  );
}

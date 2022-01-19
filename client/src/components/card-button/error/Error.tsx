import React from 'react';

import './styles.css';

const genericError = `
    Something went wrong. Perhaps, the service is busy or there is
    something wrong with your settings/token.
    Please try again later or contant the your administrator
`;

export function Error(): JSX.Element {
  return (
      <div className='onlyoffice_error'>
          <p className='onlyoffice_error__header'>System error</p>
          <p className='onlyoffice_error__text'>
              {genericError}
          </p>
          <div className='onlyoffice_error__background'/>
          <div className='onlyoffice_error__background'/>
          <div className='onlyoffice_error__background'/>
      </div>
  );
}

import React from 'react';

const handleClick = (): void => {
  window.open('https://www.onlyoffice.com/en/docs-enterprise-prices.aspx');
};

export function Info(): JSX.Element {
  return (
      <div
          className='onlyoffice_settings__info'
      >
          <p className='onlyoffice_settings__info__text'>
              Full access to ONLYOFFICE Docs server
          </p>
          <button
              className='onlyoffice_settings__info__button'
              type='button'
              onClick={handleClick}
          >
              See plans
          </button>
      </div>
  );
}

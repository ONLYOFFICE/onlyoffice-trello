import React from 'react';

const handleClick = (): void => {
  window.open('https://www.onlyoffice.com/en/docs-enterprise-prices.aspx');
};

export function Info(): JSX.Element {
  return (
      <div
          className='onlyoffice-settings_info'
      >
          <p className='onlyoffice-settings_info__text'>
              Full access to ONLYOFFICE Docs server
          </p>
          <button
              className='onlyoffice-settings_info__button'
              type='button'
              onClick={handleClick}
          >
              See plans
          </button>
      </div>
  );
}

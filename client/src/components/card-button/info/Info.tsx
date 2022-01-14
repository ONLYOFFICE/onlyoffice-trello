import React, {useCallback, useState} from 'react';

import constants from 'root/utils/const';

import info from 'public/images/info.svg';
import cross from 'public/images/cross.svg';

import './styles.css';

const handleCloseAnimation = (): void => {
  const infoContainer = document.getElementById('onlyoffice_info_container');
  infoContainer?.classList.add('info-container_close');
};

export function Info(): JSX.Element | null {
  const [closed, setClosed] = useState(
    () => Boolean(
      localStorage.getItem(constants.ONLYOFFICE_LOCAL_STORAGE_INFO_CLOSED),
    ) || false,
  );

  const handleClose = useCallback(() => {
    handleCloseAnimation();
    setTimeout(() => {
      setClosed(true);
    }, 300);
  }, []);

  const handlePermanentClose = useCallback(() => {
    localStorage.setItem(
      constants.ONLYOFFICE_LOCAL_STORAGE_INFO_CLOSED,
      'true',
    );
    handleClose();
  }, [handleClose]);

  if (closed) {
    return null;
  }

  return (
      <div
          id='onlyoffice_info_container'
          className='info-container'
      >
          <div className='info-container__top'>
              <img
                  alt='info badge'
                  className='info-container__top__icon'
                  style={{
                    marginLeft: '1rem',
                    marginRight: '0.5rem',
                    width: '1rem',
                  }}
                  src={info as string}
              />
              <b className='info-container__main-text'>
                  ONLYOFFICE Power-Up proxy can handle files less than 1.5 MB
              </b>
              {/* eslint-disable-next-line */}
              <img
                  alt='info close button'
                  className='info-container__top__icon'
                  style={{paddingRight: '1rem', width: '0.5rem'}}
                  src={cross as string}
                  onClick={handleClose}
              />
          </div>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
              role='button'
              tabIndex={0}
              className='info-container__bottom'
              onClick={handlePermanentClose}
              onKeyPress={
                (e) => (e.key === 'Enter' ? handlePermanentClose() : null)
              }
          >
              Never show again
          </a>
      </div>
  );
}

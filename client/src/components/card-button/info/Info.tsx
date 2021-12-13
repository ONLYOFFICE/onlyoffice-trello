import React, { useState } from 'react';

import info from 'Public/images/info.svg';
import cross from 'Public/images/cross.svg';

import './styles.css';

export const Info = () => {
  const [closed, setClosed] = useState(() => {
    return !!localStorage.getItem('onlyoffice_info_closed') || false;
  });

  if (closed) return null;

  const handleClose = () => {
    const infoContainer = document.getElementById('onlyoffice_info_container');
    infoContainer?.classList.add('info-container_close');
    setTimeout(() => {
      setClosed(true);
    }, 300);
  }

  return (
    <div id='onlyoffice_info_container' className='info-container'>
      <div className='info-container__top'>
        <img
          className='info-container__top__icon'
          style={{ marginLeft: '1rem', marginRight: '0.5rem', width: '1rem' }}
          src={info}
        />
        <b className='info-container__main-text'>
          {'ONLYOFFICE Power-Up is suitable for files less than 2.5 MB'}
        </b>
        <img
          className='info-container__top__icon'
          style={{ paddingRight: '1rem', width: '0.5rem' }}
          src={cross}
          onClick={handleClose}
        />
      </div>
      <a
        className='info-container__bottom'
        onClick={() => {
          localStorage.setItem('onlyoffice_info_closed', 'true');
          handleClose();
        }}
      >
        {'Never show again'}
      </a>
    </div>
  );
};

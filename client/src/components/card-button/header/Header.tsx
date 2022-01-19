/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

import {Searchbar} from 'components/card-button/searchbar/Searchbar';

import logo from 'public/images/logo.svg';
import './styles.css';

export function Header(): JSX.Element {
  return (
      <div className='onlyoffice_modal-header'>
          <img
              alt='ONLYOFFICE'
              src={logo as string}
              style={{cursor: 'pointer'}}
              onClick={() => window.open('https://www.onlyoffice.com/')}
          />
          <Searchbar/>
      </div>
  );
}

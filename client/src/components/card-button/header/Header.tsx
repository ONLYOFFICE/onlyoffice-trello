import React from 'react';

import { Searchbar } from 'Components/card-button/searchbar/Searchbar';
import logo from 'Public/images/logo.svg';

import './styles.css';

export const Header = () => {
  return (
    <div className='modal_header'>
      <img
        src={logo}
        style={{ cursor: 'pointer' }}
        onClick={() => window.open('https://www.onlyoffice.com/')}
      />
      <Searchbar />
    </div>
  );
};

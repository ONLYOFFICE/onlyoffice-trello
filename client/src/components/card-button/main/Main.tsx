import React from 'react';

import './styles.css';

export function Main({children}: {children: React.ReactNode}): JSX.Element {
  return (
      <div className='modal_main-container'>
          {children}
      </div>
  );
}

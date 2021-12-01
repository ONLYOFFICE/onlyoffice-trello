import React from "react";
import './styles.css';

export const Dropdown = () => {
  return (
    <div className="file_header__dropdown">
      <div className="file_header__dropdown__btn">
        <b>Sorting</b>
        <a className="file_header__dropdown_arrow"></a>
      </div>
      <div className="file_header__dropdown__content">
        <a>Name</a>
        <a>Size</a>
        <a>Type</a>
        <a>Last modified</a>
      </div>
    </div>
  );
};

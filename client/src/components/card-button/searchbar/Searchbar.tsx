import React from "react";
import './styles.css';
import search from "../../../../public/images/search.svg";

export const Searchbar = () => {
  return (
    <div id="searchbar_container">
      <input id="searchbar_container__input" type="text" placeholder="Search" />
      <button id="searchbar_container__btn" type="submit">
        <img src={search}/>
      </button>
    </div>
  );
};

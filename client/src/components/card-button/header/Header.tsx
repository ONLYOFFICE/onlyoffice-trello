import React from "react";
import logo from "../../../../public/images/logo.svg";
import { Searchbar } from "../searchbar/Searchbar";
import "./styles.css";

export const Header = () => {
  return (
    <div
      className="onlyoffice-header"
    >
      <img src={logo} style={{cursor: 'pointer'}} onClick={() => window.open('https://www.onlyoffice.com/')} />
      <Searchbar />
    </div>
  );
};

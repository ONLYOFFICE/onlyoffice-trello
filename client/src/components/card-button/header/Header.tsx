import React from "react";
import logo from "../../../../public/images/logo.svg";
import { Searchbar } from "../searchbar/Searchbar";

export const Header = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "auto",
        marginBottom: "1rem",
      }}
    >
      <img src={logo} />
      <Searchbar />
    </div>
  );
};

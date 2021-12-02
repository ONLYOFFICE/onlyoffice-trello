import React from "react";
import info from "../../../../public/images/info.svg";
import cross from "../../../../public/images/cross.svg";
import "./styles.css";

export const Info = () => {
  return (
    <div className="info-container" style={{ position: "relative" }}>
      <div className="info-container__top">
        <img
          className="info-container__item__icon"
          style={{ marginLeft: "1rem", marginRight: "0.5rem", width: "1rem" }}
          src={info}
        />
        <b className="info-container__item__main-text">
          ONLYOFFICE Power-Up is suitable for files less than 5 MB
        </b>
        <img
          className="info-container__item__icon"
          style={{ paddingRight: "1rem", width: "0.5rem" }}
          src={cross}
        />
      </div>
      <a className="info-container__item__bottom">Never show again</a>
    </div>
  );
};

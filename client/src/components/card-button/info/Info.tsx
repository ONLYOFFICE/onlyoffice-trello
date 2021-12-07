import React, { useState } from "react";
import info from "../../../../public/images/info.svg";
import cross from "../../../../public/images/cross.svg";
import "./styles.css";

export const Info = () => {
  const [closed, setClosed] = useState(() => {
    return !!localStorage.getItem("onlyoffice_info_closed") || false;
  });
  if (closed) return null;
  const handleClose = () => {
    const infoContainer = document.getElementById('onlyoffice_info_container');
    infoContainer?.classList.add('info-container_close');
    setTimeout(() => {
      setClosed(true);
    }, 500);
  }
  return (
    <div id='onlyoffice_info_container' className="info-container" style={{ position: "relative" }}>
      <div className="info-container__top">
        <img
          className="info-container__item__icon"
          style={{ marginLeft: "1rem", marginRight: "0.5rem", width: "1rem" }}
          src={info}
        />
        <b className="info-container__item__main-text">
          ONLYOFFICE Power-Up is suitable for files less than 3 MB
        </b>
        <img
          className="info-container__item__icon"
          style={{ paddingRight: "1rem", width: "0.5rem" }}
          src={cross}
          onClick={handleClose}
        />
      </div>
      <a
        className="info-container__item__bottom"
        onClick={() => {
          localStorage.setItem("onlyoffice_info_closed", "true");
          handleClose();
        }}
      >
        Never show again
      </a>
    </div>
  );
};

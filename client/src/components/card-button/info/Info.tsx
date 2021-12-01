import React from "react";
import info from "../../../../public/images/info.svg";
import cross from "../../../../public/images/cross.svg";
import "./styles.css";

export const Info = () => {
  return (
    <div className="info-container">
      <img className="info-container__item__icon" src={info} />
      <b style={{ justifySelf: "start" }}>
        ONLYOFFICE Power-Up is suitable for files less than 5 MB
      </b>
      <img className="info-container__item__icon" src={cross} />
      <p className="info-container__item__main">
        Only files below this limit can be opened here. .....
      </p>
      <b className="info-container__item__main">Never show again</b>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import dateFormat from 'dateformat';
import "./styles.css";
//TODO: Alias
import download from "../../../../public/images/download.svg";
import { getIconByExt } from "../../../utils/file";
import { Dropdown } from "../dropdown/Dropdown";

export const FileContainer: React.FC = ({ children }) => {
  return (
    <>
      <div className="file_header">
        <h2>Files</h2>
        <div>
          <Dropdown />
        </div>
      </div>
      <div className="file_container">{children}</div>
    </>
  );
};

//TODO: Types
export const File: React.FC<{ file: any, handleDownload: (attachment: string, filename: string) => Promise<void> }> = (props) => {
  const [isMobile, setIsMobile] = useState(() => {
    return window.innerWidth <= 941;
  });
  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 941);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  const extIcon = getIconByExt(props.file.name.split('.')[1]);
  return (
    <div className="file_container_item">
      {!isMobile ? (
        <>
          <div
            className="file_container_item__main"
            style={{ maxWidth: "50%" }}
          >
            <img src={extIcon} />
            <h2>{props.file.name}</h2>
          </div>
          <div
            style={{ display: "flex", maxWidth: "40%", marginRight: "4rem" }}
          >
            <p
              className="file_container_item__main__text__item"
              style={{ marginRight: "4rem" }}
            >
              {(props.file.bytes / 1000000).toFixed(2)} MB
            </p>
            <p className="file_container_item__main__text__item file_container_item__main__text__item_long">
              {dateFormat(props.file.date, 'd/m/yy HH:MM')}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="file_container_item__main">
            <img src={extIcon} />
            <div className="file_container_item__main_mobile">
              <h2>{props.file.name}</h2>
              <div className="file_container_item__main__text">
                <p className="file_container_item__main__text__item">{(props.file.bytes / 1000000).toFixed(2)} MB</p>
                <p className="file_container_item__main__text__item file_container_item__main__text__item_long">
                  {dateFormat(props.file.date, 'd/m/yy HH:MM')}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="file_container_item__controls">
        <button>
          <a href={props.file.url} download>
            <img src={download} alt="onlyoffice_download" />
          </a>
        </button>
        {
          parseFloat((props.file.bytes / 1000000).toFixed(2)) < 3 ?
            <button onClick={() => props.handleDownload(props.file.id, props.file.name)}>Edit in ONLYOFFICE</button> :
            null
        }
      </div>
    </div>
  );
};

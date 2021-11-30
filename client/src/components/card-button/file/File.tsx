import React from "react";
import "./styles.css";
//TODO: Alias
import word from "../../../../public/images/word.svg";
import download from "../../../../public/images/download.svg";

export const FileContainer: React.FC = ({ children }) => {
  return (
    <>
      <div className="file_header">
          <h2>Files</h2>
            <div className='file_header__dropdown'>
                <div className='file_header__dropdown__btn'>
                  <b>
                    Sorting
                  </b>
                  <a className='file_header__dropdown_arrow'></a>
                </div>
                <div className='file_header__dropdown__content'>
                    <a>Name</a>
                    <a>Size</a>
                    <a>Type</a>
                    <a>Last modified</a>
                </div>
            </div>
      </div>
      <div className="file_container">{children}</div>
    </>
  );
};

export const File = () => {
  return (
    <div className="file_container_item">
    <div className="file_container_item__main">
      <img src={word} />
      <h2 className="file_container_item_main__desktop">File.docx</h2>
      <div className='file_container_item__main__text'>
        <h2>File.docx</h2>
        <div>
          <p className='file_container_item__main__text__item'>4.72kB</p>
          <p className='file_container_item__main__text__item'>Updated 50 minutes ago</p>
        </div>
      </div>
    </div>
    <div className="file_container_item__controls">
      <button>
        <img src={download} alt="onlyoffice_download" />
      </button>
      <button>Edit in ONLYOFFICE</button>
    </div>
  </div>
      /* <div className="file_container_item__size">4.72kB</div>
      <div className="file_container_item__updated">Updated 50 minutes ago</div> */
  );
};

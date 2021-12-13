import React from "react";

import './styles.css';

export const Main: React.FC = ({ children }) => {
  return <div className="modal_main-container">{children}</div>;
};

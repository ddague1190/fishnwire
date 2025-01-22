import React from "react";
import ReactDOM from "react-dom";
import "./loader.styles.scss";
import { css } from "@emotion/react";

import ClipLoader from "react-spinners/ClipLoader";

const Loader = () => {
  const override = css`
    border-width: 4px;
  `;

  return ReactDOM.createPortal(
    <div className='loader'>
      <ClipLoader css={override} size={150}></ClipLoader>
    </div>,
    document.body
  );
};

export default Loader;

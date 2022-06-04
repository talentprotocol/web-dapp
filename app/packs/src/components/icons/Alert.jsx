import React from "react";
import Icon from "src/components/design_system/icon";

const Alert = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#clip0_751_3386)">
      <path
        fill="#7A55FF"
        d="M8 0a8 8 0 100 16A8 8 0 008 0zm.167 3.333a1 1 0 110 2 1 1 0 010-2zm1.5 9H7A.667.667 0 117 11h.5a.167.167 0 00.167-.167v-3a.167.167 0 00-.167-.166H7a.667.667 0 110-1.334h.667A1.333 1.333 0 019 7.667v3.166a.167.167 0 00.167.167h.5a.666.666 0 110 1.333z"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_751_3386">
        <path fill="#fff" d="M0 0H16V16H0z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default Alert;

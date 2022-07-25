import React from "react";
import { ToastContainer } from "react-toastify";

const StyledToastContainer = ({ mode }) => (
  <ToastContainer
    position="top-right"
    autoClose={false}
    newestOnTop={false}
    closeOnClick
    hideProgressBar={true}
    theme={mode.theme == "light-body" ? "light" : "dark"}
  />
);

export default StyledToastContainer;

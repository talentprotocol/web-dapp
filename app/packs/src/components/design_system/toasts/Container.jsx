import React from "react";
import { ToastContainer } from "react-toastify";

const StyledToastContainer = ({ mode }) => (
  <ToastContainer
    position="top-right"
    autoClose={false}
    newestOnTop={false}
    closeOnClick
    hideProgressBar={true}
    theme={mode}
  />
);

export default StyledToastContainer;

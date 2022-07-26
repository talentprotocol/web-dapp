import React from "react";
import { toast } from "react-toastify";
import { ToastWarning } from "src/components/icons";
import {
  StyledToastContainer,
  ToastBody,
} from "src/components/design_system/toasts";

const FlashMessages = ({ messages, mode }) => {
  messages &&
    messages.map((message) => {
      switch (message.type) {
        case "success":
          toast.success(
            <ToastBody
              heading={message.heading}
              body={message.body}
              mode={mode}
            />
          );
          break;
        case "error":
          toast.error(
            <ToastBody
              heading={message.heading}
              body={message.body}
              mode={mode}
            />
          );
          break;
        case "warning":
          toast.warning(
            <ToastBody
              heading={message.heading}
              body={message.body}
              mode={mode}
            />,
            {
              icon: ToastWarning,
            }
          );
          break;
        case "info":
          toast.info(
            <ToastBody
              heading={message.heading}
              body={message.body}
              mode={mode}
            />
          );
          break;
      }
    });

  const theme = mode.includes("body") ? mode.split("-")[0] : mode;
  return <StyledToastContainer mode={theme} />;
};

export default FlashMessages;

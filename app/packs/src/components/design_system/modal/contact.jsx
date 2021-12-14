import React from "react";
import TextInput from "../fields/textinput";
import Caption from "src/components/design_system/typography/caption";

const Modal = ({ mode }) => {
  return (
    <div className={`modal-dialog ${mode}`}>
      <div className={`modal-content ${mode}`}>
        <div className="modal-header">
          <strong className={`modal-title ${mode}`}>Search contact</strong>

          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className={`modal-body ${mode}`}>
          <TextInput placeholder="Search people" />
          <div className="mt-1">
            <Caption mode={`${mode}`} text="Supporting"></Caption>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

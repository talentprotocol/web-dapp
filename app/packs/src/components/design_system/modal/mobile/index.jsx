import React from "react";

const Modal = ({ mode, title, description, button_text, onClick }) => {
  return (
    <div className="col-lg-3">
      <div className={`modal-dialog mobile ${mode}`}>
        <div className={`modal-content ${mode}`}>
          <div className="modal-header">
            {title ? (
              <strong className={`modal-title ${mode}`}>{title}</strong>
            ) : null}

            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className={`modal-body mobile ${mode}`}>
            {description ? (
              <span className={`${mode}`}>{description}</span>
            ) : null}

            {button_text ? (
              <button
                type="button"
                className="btn btn-primary button-confirm"
                style={{ width: "100%" }}
                onClick={onClick}
              >
                {button_text}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

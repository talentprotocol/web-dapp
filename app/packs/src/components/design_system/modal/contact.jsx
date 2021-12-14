import React from "react";
import TextInput from "../fields/textinput";
import Caption from "src/components/design_system/typography/caption";
import Avatar from "src/components/design_system/avatar";

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
            <Caption
              className="text-muted"
              mode={`${mode}`}
              text="Supporting"
            ></Caption>
            <div className="mt-1">
              <Avatar
                name="John Travolta"
                imgUrl="https://i.pravatar.cc/150?img=1"
                size="big"
                mode={`${mode}`}
              />
            </div>

            <div className="mt-1">
              <Avatar
                name="Mary Johnsson"
                imgUrl="https://i.pravatar.cc/150?img=11"
                size="big"
                mode={`${mode}`}
              />
            </div>
          </div>

          <div className="mt-1">
            <Caption
              className="text-muted"
              mode={`${mode}`}
              text="Supporters"
            ></Caption>
            <div className="mt-1">
              <Avatar
                name="Juan Fernandez"
                imgUrl="https://i.pravatar.cc/150?img=24"
                size="big"
                mode={`${mode}`}
              />
            </div>

            <div className="mt-1">
              <Avatar
                name="John Deep"
                imgUrl="https://i.pravatar.cc/150?img=15"
                size="big"
                mode={`${mode}`}
              />
            </div>
          </div>

          <div className="mt-1">
            <Caption
              className="text-muted"
              mode={`${mode}`}
              text="Watchlist"
            ></Caption>
            <div className="mt-1">
              <Avatar
                name="Andrew Lily"
                imgUrl="https://i.pravatar.cc/150?img=3"
                size="big"
                mode={`${mode}`}
              />
            </div>

            <div className="mt-1">
              <Avatar
                name="Mary Johnsson"
                imgUrl="https://i.pravatar.cc/150?img=9"
                size="big"
                mode={`${mode}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

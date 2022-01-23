import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "src/components/design_system/button";
import TextArea from "src/components/design_system/fields/textarea";
import debounce from "lodash/debounce";
import { post } from "src/utils/requests";

const NewMessageToAllSupportersModal = ({ show, setShow, mode, mobile }) => {
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const sendMessage = () => {
    if (message.replace(/\s+/g, "") == "") {
      return;
    }

    setSendingMessage(true);

    post("/messages/send_to_all_supporters", { message }).then((response) => {
      if (response.error) {
        console.log(response.error);
        // setError("Unable to send message, try again") // @TODO: Create error box (absolute positioned)
      } else {
        const lastMessage = response[response.length - 1]
        setShow(false)
        window.location.href = `/messages?user=${lastMessage.receiver_id}`;
      }
      setSendingMessage(false);
    });
  };

  const debouncedNewMessage = debounce(() => sendMessage(), 200);

  return (
    <Modal
      scrollable={true}
      show={show}
      centered
      onHide={() => setShow(false)}
      dialogClassName={mobile ? "mw-100 mh-100 m-0" : "remove-background"}
      fullscreen={"md-down"}
    >
      <Modal.Body className="show-grid p-4">
        <TextArea
            mode={mode}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share something with your supporters"
            className="w-100 mr-2"
            rows="5"
          />

        <Button
          type="primary-default"
          onClick={debouncedNewMessage}
          disabled={sendingMessage} 
          className="mt-2 float-right"
        >
          Send message
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default NewMessageToAllSupportersModal;

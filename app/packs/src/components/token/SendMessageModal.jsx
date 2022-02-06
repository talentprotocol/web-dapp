import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "src/components/design_system/button";
import TextArea from "src/components/design_system/fields/textarea";
import { H3 } from "src/components/design_system/typography";
import { P2 } from "src/components/design_system/typography";
import Link from "src/components/design_system/link";
import { Check }  from "src/components/icons";
import debounce from "lodash/debounce";
import { post } from "src/utils/requests";

const SuccessConfirmation = ({ mode, redirectToMessages }) => (
  <>
    <Modal.Header closeButton>
      <Modal.Title className="px-3"></Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="d-flex flex-column justify-content-center align-items-center w-100 px-3">
        <P2 className="mb-5">Message sent successfully!</P2>
        <Check width="64" height="64" color="#1DB954" />
        <Button
          onClick={redirectToMessages}
          type="primary-default"
          mode={mode}
          className="w-100 my-6"
        >
          Check Messages
        </Button>
      </div>
    </Modal.Body>
  </>
);

const SendMessage = ({
  mode,
  setMessage,
  amountBought,
  ticker,
  talentName,
  hide,
  sendMessage,
  sendingMessage
}) => (
  <>
    <Modal.Header className="d-flex flex-column justify-content-center align-items-center">
      <Check width="64" height="64" color="#1DB954" className="my-6"/>
      <H3 mode={mode} text="Congratulations!" bold className="py-1"/>
      <P2 
        mode={mode}
        text={`You've just bought ${amountBought} ${ticker}. You can now start a conversation with ${talentName}`}
        className="px-4 text-center"
      />
    </Modal.Header>
    <Modal.Body className="show-grid p-4">
      <TextArea
          mode={mode}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share something with your supporters"
          className="w-100 mr-2 py-3"
          rows="5"
        />

      <Button
        type="primary-default"
        onClick={sendMessage}
        disabled={sendingMessage} 
        className="mt-2 float-right"
      >
        Send message
      </Button>

      <button className="button-link normal-size-button float-right mt-1" onClick={hide}>
        <Link text="Maybe later!" className="text-primary" />
      </button>
    </Modal.Body>
  </>
);

const SendMessageModal = ({ show, setShow, amountBought, ticker, talentName, talentId, mode }) => {
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const sendMessage = () => {
    if (message.replace(/\s+/g, "") == "") {
      return;
    }

    setSendingMessage(true);

    post("/messages", { id: talentId, message }).then((response) => {
      if (response.error) {
        console.log(response.error);
        // setError("Unable to send message, try again") // @TODO: Create error box (absolute positioned)
      } else {
        setSendingMessage(false);
        setMessageSent(true)
      }
    });
  };

  const debouncedNewMessage = debounce(() => sendMessage(), 200);

  const hide = () => setShow(false);

  const redirectToMessages = () => {
    hide();
    window.location.href = `/messages?user=${talentId}`;
  };

  const getCurrentModal = () => {
    if (messageSent) {
      return SuccessConfirmation;
    } else {
      return SendMessage;
    }
  };

  const CurrentModal = getCurrentModal();

  return (
    <Modal
      scrollable={true}
      show={show}
      centered
      onHide={hide}
      dialogClassName="remove-background"
      fullscreen={"md-down"}
    >
      <CurrentModal
        mode={mode}
        redirectToMessages={redirectToMessages}
        setMessage={setMessage}
        amountBought={amountBought}
        ticker={ticker}
        talentName={talentName}
        hide={hide}
        sendMessage={debouncedNewMessage}
        sendingMessage={sendingMessage}
      />
    </Modal>
  );
};

export default SendMessageModal;

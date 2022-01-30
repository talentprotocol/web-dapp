import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "src/components/design_system/button";
import TextArea from "src/components/design_system/fields/textarea";
import { P3 } from "src/components/design_system/typography";
import debounce from "lodash/debounce";
import { get, post } from "src/utils/requests";

const NewMessageToAllSupportersModal = ({ show, setShow, mode, mobile }) => {
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [pollingIntervalId, setPollingIntervalId] = useState();
  const [messagesSent, setMessagesSent] = useState(0);
  const [messagesTotal, setMessagesTotal] = useState(0);

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
        window.sessionStorage.setItem("send_to_all_supporters_job_id", response.job_id);
        retrieveProgress();
        setPollingIntervalId(setInterval(retrieveProgress, 2000));
      }
      setSendingMessage(false);
    });
  };

  const debouncedNewMessage = debounce(() => sendMessage(), 200);

  const retrieveProgress = () => {
    const job_id = window.sessionStorage.getItem("send_to_all_supporters_job_id");
    get(`/messages/send_to_all_supporters_status?job_id=${job_id}`).then((response) => {
      if (response.error) {
        console.log(response.error);
      } else {
        setMessagesSent(response.messages_sent);
        setMessagesTotal(response.messages_total);

        if(response.messages_sent == response.messages_total && response.messages_total != 0) {
          clearPollingInterval(response.last_receiver_id);
        }
      }
    });
  }

  const clearPollingInterval = (receiver_id) => {
    clearInterval(pollingIntervalId);
    setPollingIntervalId(false);
    window.sessionStorage.setItem("send_to_all_supporters_job_id", null);
    setShow(false);
    window.location.href = `/messages?user=${receiver_id}`;
  }

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
        {
          pollingIntervalId
          &&
          messagesTotal > 0
          &&
          <P3 className="w-100 mt-2">
            {`We're sending the message to your supporters! We've already sent ${messagesSent} of ${messagesTotal} messages`}
          </P3>
        }
      </Modal.Body>
    </Modal>
  );
};

export default NewMessageToAllSupportersModal;

import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import {
  faCheckCircle,
  faTimesCircle,
  faCircle,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TradeModal = ({
  show,
  onFinish,
  mode,
  trackToken,
  transact,
  approved,
  submitted,
  confirmed,
  done,
  stepError,
}) => {
  useEffect(() => {
    if (show) {
      transact();
    }
  }, [show]);

  const approvalIcon = () => {
    if (stepError == "approval") {
      return faTimesCircle;
    }

    return approved ? faCheckCircle : faCircleNotch;
  };
  const approvalColor = () => {
    if (stepError == "approval") {
      return "text-danger";
    }

    return approved ? "text-success" : "text-light";
  };

  const submitIcon = () => {
    if (stepError == "confirm") {
      return faTimesCircle;
    }

    return submitted ? faCheckCircle : approved ? faCircleNotch : faCircle;
  };
  const submitColor = () => {
    if (stepError == "confirm") {
      return "text-danger";
    }

    return submitted ? "text-success" : "text-light";
  };

  const confirmIcon = () => {
    if (stepError == "confirm") {
      return faTimesCircle;
    }

    return confirmed ? faCheckCircle : submitted ? faCircleNotch : faCircle;
  };
  const confirmColor = () => {
    if (stepError == "confirm") {
      return "text-danger";
    }

    return confirmed ? "text-success" : "text-light";
  };

  const doneIcon = () => {
    if (stepError == "done") {
      return faTimesCircle;
    }

    return done ? faCheckCircle : confirmed ? faCircleNotch : faCircle;
  };
  const doneColor = () => {
    if (stepError == "done") {
      return "text-danger";
    }

    return done ? "text-success" : "text-light";
  };

  return (
    <Modal show={show} onHide={onFinish} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Trade</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          We currently don't support background transactions, please leave this
          window open while we wait for confirmation.
        </p>
        <div className="d-flex flex-row justify-content-center align-items-center">
          {mode == "buy" && (
            <div className="d-flex flex-column justify-content-center align-items-end">
              <p>Approval</p>
              <FontAwesomeIcon
                icon={approvalIcon()}
                size="3x"
                spin={!approved && stepError != "approval"}
                className={approvalColor()}
              />
              <p className="text-white-space-wrap"> </p>
            </div>
          )}
          {mode == "buy" && (
            <div
              className={`border border-${approved ? "success" : "light"}`}
              style={{ height: 2, width: 50 }}
            ></div>
          )}
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ marginRight: -3, marginLeft: -3 }}
          >
            <p>Submit</p>
            <FontAwesomeIcon
              icon={submitIcon()}
              size="3x"
              spin={approved && !submitted && stepError != "confirm"}
              className={submitColor()}
            />
            <p className="text-white-space-wrap"> </p>
          </div>
          <div
            className={`border border-${
              stepError == "confirm"
                ? "danger"
                : submitted
                ? "success"
                : "light"
            }`}
            style={{ height: 2, width: 50 }}
          ></div>
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ marginRight: -7, marginLeft: -7 }}
          >
            <p>Confirm</p>
            <FontAwesomeIcon
              icon={confirmIcon()}
              size="3x"
              spin={submitted && !confirmed && stepError != "confirm"}
              className={confirmColor()}
            />
            <p className="text-white-space-wrap"> </p>
          </div>
          <div
            className={`border border-${confirmed ? "success" : "light"}`}
            style={{ height: 2, width: 50 }}
          ></div>
          <div className="d-flex flex-column justify-content-center align-items-start">
            <p>Finalize</p>
            <FontAwesomeIcon
              icon={doneIcon()}
              spin={confirmed && !done && stepError != "done"}
              size="3x"
              className={doneColor()}
            />
            <p className="text-white-space-wrap"> </p>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="talent-button btn btn-light" onClick={trackToken}>
          Track Token
        </button>
        <button
          disabled={!done && stepError == ""}
          className="talent-button btn-primary btn"
          onClick={onFinish}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TradeModal;

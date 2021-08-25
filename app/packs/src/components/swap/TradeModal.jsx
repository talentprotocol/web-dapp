import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { faSquare, faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TradeModal = ({
  show,
  onFinish,
  mode,
  trackToken,
  transact,
  approved,
  requested,
  confirmed,
  done,
}) => {
  useEffect(() => {
    if (show) {
      transact();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onFinish} backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Trade</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          We currently don't support background transactions, please leave this
          window open while we wait for confirmation.
        </p>
        <div className="d-flex flex-column">
          {mode == "buy" &&
            (approved ? (
              <p>
                <FontAwesomeIcon
                  icon={faCheckSquare}
                  className="text-success"
                />{" "}
                Approval to spend $TAL confirmed
              </p>
            ) : (
              <p>
                <FontAwesomeIcon icon={faSquare} /> $TAL approval
              </p>
            ))}
          {requested ? (
            <p>
              <FontAwesomeIcon icon={faCheckSquare} className="text-success" />{" "}
              Transaction submitted
            </p>
          ) : (
            <p>
              <FontAwesomeIcon icon={faSquare} /> Transaction submition
            </p>
          )}
          {confirmed ? (
            <p>
              <FontAwesomeIcon icon={faCheckSquare} className="text-success" />{" "}
              Transaction confirmed
            </p>
          ) : (
            <p>
              <FontAwesomeIcon icon={faSquare} /> Transaction confirmation.
            </p>
          )}

          {done ? (
            <p>
              <FontAwesomeIcon icon={faCheckSquare} className="text-success" />{" "}
              Added transaction
            </p>
          ) : (
            <p>
              <FontAwesomeIcon icon={faSquare} /> Add transaction to our records
            </p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="talent-button btn btn-light" onClick={trackToken}>
          Track Token
        </button>
        <button
          disabled={!done}
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

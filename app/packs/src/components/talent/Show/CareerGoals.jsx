import React, { useState, useRef, useEffect } from "react";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";

import { patch, post } from "src/utils/requests";

import Button from "../../button";

const CareerGoals = ({ careerGoal, allowEdit, talentId }) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [careerGoalId, setCareerGoalId] = useState(careerGoal.id);
  const [careerGoalText, setCareerGoalText] = useState(
    careerGoal.description || ""
  );
  const textInputRef = useRef(null);

  const handleShow = () => setShow(true);
  const handleDismiss = () => {
    setCareerGoalText(description);
    setShow(false);
  };
  const handleSave = async () => {
    const method = careerGoalId ? patch : post;

    const response = await method(
      `/talent/${talentId}/career_goals${
        careerGoalId ? "/" + careerGoalId : ""
      }`,
      { career_goal: { description: careerGoalText } }
    );
    if (response.error) {
      setError(true);
    } else {
      setShow(false);
      setCareerGoalId(response.career_goal.id);
    }
  };

  useEffect(() => {
    if (show && textInputRef && textInputRef.current.scrollHeight > 20) {
      textInputRef.current.style.height =
        textInputRef.current.scrollHeight + 3 + "px";
    }
  }, [show]);

  return (
    <div className="mb-3 mb-md-5">
      <div className="d-flex flex-row mb-3 align-items-center">
        <h6 className="talent-show-h6 p-2 mr-2">CAREER GOAL</h6>
        {allowEdit && (
          <button
            onClick={handleShow}
            className="btn btn-outline-secondary talent-button border-0"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
        <Modal show={show} onHide={handleDismiss}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Career Goal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <p className="text-danger">
                Unable to update career goal. Check if you added invalid
                characters.
              </p>
            )}
            <textarea
              ref={textInputRef}
              id="text"
              value={careerGoalText}
              onChange={(e) => setCareerGoalText(e.target.value)}
              placeholder="Add a brief description.."
              className="form-control"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="secondary"
              text="Discard Changes"
              onClick={handleDismiss}
            />
            <Button type="primary" text="Save Changes" onClick={handleSave} />
          </Modal.Footer>
        </Modal>
      </div>
      <p className="mt-3 mb-0 talent-long-description">{careerGoalText}</p>
    </div>
  );
};

export default CareerGoals;

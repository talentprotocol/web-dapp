import React, { useState } from "react";
import { faEdit, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";

import { patch, post } from "src/utils/requests";

import Button from "../../button";

const Rewards = ({ rewards, ticker, allowEdit, talentId }) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("Add");
  const [error, setError] = useState(false);
  const [allRewards, setAllRewards] = useState(rewards);
  const [editingReward, setEditingReward] = useState({
    description: "",
    required_amount: "0",
    required_text: "",
  });

  const handlePlusShow = () => {
    setMode("Add");
    setEditingReward({
      description: "",
      required_amount: "0",
      required_text: "",
    });
    setShow(true);
  };
  const handleEditShow = (reward) => {
    setMode("Edit");
    setEditingReward(reward);
    setShow(true);
  };
  const handleDismiss = () => {
    setShow(false);
    setEditingReward({
      description: "",
      required_amount: "0",
      required_text: "",
    });
  };
  const setDescription = (value) => {
    setEditingReward({ ...editingReward, description: value });
  };
  const setRequiredAmount = (value) => {
    setEditingReward({ ...editingReward, required_amount: value });
  };
  const setRequiredText = (value) => {
    setEditingReward({ ...editingReward, required_text: value });
  };
  const validInput = () =>
    editingReward.description != "" &&
    (editingReward.required_text != "" ||
      (editingReward.required_amount !== "0" &&
        editingReward.required_amount != ""));
  const handleSave = async (e) => {
    e.preventDefault();

    if (!validInput()) {
      return;
    }

    const method = editingReward.id ? patch : post;

    const response = await method(
      `/talent/${talentId}/rewards${
        editingReward.id ? "/" + editingReward.id : ""
      }`,
      { reward: { ...editingReward } }
    );
    if (response.error) {
      setError(true);
    } else {
      const index = allRewards.findIndex(
        (element) => element.id == response.id
      );

      if (index == -1) {
        setAllRewards([...allRewards, response]);
      } else {
        const newRewards = [...rewards];
        newRewards[index] = response;
        setAllRewards(newRewards);
      }
      setShow(false);
    }
  };

  return (
    <div className="mb-3 mb-md-5">
      <div className="d-flex flex-row mb-3 align-items-center">
        <h6 className="talent-show-h6 p-2 d-inline mb-2 mr-2">
          SERVICES & PERKS
        </h6>
        {allowEdit && (
          <button
            onClick={handlePlusShow}
            className="btn btn-outline-secondary talent-button border-0"
          >
            <FontAwesomeIcon icon={faPlusSquare} />
          </button>
        )}
        <Modal show={show} onHide={handleDismiss}>
          <Modal.Header closeButton>
            <Modal.Title>{mode} Service & Perk</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSave}>
            <Modal.Body>
              <div className="d-flex flex-column py-2">
                {error && (
                  <p className="text-danger">
                    Unable to update Services & Perks. Check if you added
                    invalid characters.
                  </p>
                )}
                <p className="text-info">
                  Either set the required amount to not be 0 or explain what is
                  required to access the service/perk.
                </p>
                <div className="form-group">
                  <label htmlFor="reward-required-amount">
                    Required amount
                  </label>
                  <input
                    type="number"
                    name="required_amount"
                    id="reward-required-amount"
                    value={editingReward.required_amount}
                    onChange={(e) => setRequiredAmount(e.target.value)}
                    placeholder="Set a required amount for this service/perk"
                    className="form-control mb-2 rounded-sm"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reward-required-text">Required text</label>
                  <input
                    type="text"
                    name="required-text"
                    id="reward-required-text"
                    value={editingReward.required_text}
                    onChange={(e) => setRequiredText(e.target.value)}
                    placeholder="Explain what is required for this service/perk"
                    className="form-control mb-2 rounded-sm"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reward-description">Description</label>
                  <input
                    type="text"
                    name="description"
                    id="reward-description"
                    value={editingReward.description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain the service/perk.."
                    className="form-control rounded-sm"
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                type="secondary"
                text="Dismiss changes"
                onClick={handleDismiss}
              />
              <button
                type="submit"
                disabled={!validInput()}
                className="btn btn-primary talent-button border-0"
              >
                Save Changes
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
      {allRewards.map((reward, index) => (
        <div
          className={`${index > 0 ? "mt-3" : "mt-4"}`}
          key={`reward-description-${index}`}
        >
          <div className="d-flex flex-row mb-3 align-items-center">
            <p className="mb-0 py-1 px-2 tal-reward-amount d-inline">
              {reward.required_amount != "0" && (
                <small>
                  <strong>
                    ✦ {reward.display_required_amount || reward.required_amount}{" "}
                    {ticker}
                  </strong>
                </small>
              )}
              {reward.required_amount == "0" && (
                <small>
                  <strong>✦ {reward.required_text}</strong>
                </small>
              )}
            </p>
            {allowEdit && (
              <button
                onClick={() => handleEditShow(reward)}
                className="btn btn-outline-secondary talent-button border-0 ml-2"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
          </div>
          <p className="mt-2 mb-0 text-break">{reward.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Rewards;

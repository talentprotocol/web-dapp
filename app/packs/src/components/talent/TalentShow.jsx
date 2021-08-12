import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player/youtube";
import { faEdit, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "react-bootstrap/Modal";

import { patch, post } from "src/utils/requests";
import LinkedInIcon from "images/linkedin.png";

import Button from "../button";
import TalentProfilePicture from "./TalentProfilePicture";
import TalentTags from "./TalentTags";

const CareerGoals = ({ careerGoal, allowEdit, talentId }) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
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
    const method = careerGoal.id ? patch : post;

    const response = await method(
      `/talent/${talentId}/career_goals${
        careerGoal.id ? "/" + careerGoal.id : ""
      }`,
      { career_goal: { description: careerGoalText } }
    );
    if (response.error) {
      setError(true);
    } else {
      setShow(false);
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
          <p className="mt-2 mb-0">{reward.description}</p>
        </div>
      ))}
    </div>
  );
};

const AboutMe = ({ description, youtubeUrl, allowEdit, talentId }) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [aboutMeText, setAboutMeText] = useState(description);
  const textInputRef = useRef(null);

  const handleShow = () => setShow(true);
  const handleDismiss = () => {
    setAboutMeText(description);
    setShow(false);
  };
  const handleSave = async () => {
    const response = await patch(`/talent/${talentId}`, {
      talent: { description: aboutMeText },
    });
    if (response.error) {
      setError(true);
    } else {
      setShow(false);
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
        <h6 className="talent-show-h6 p-2 mr-2">ABOUT ME</h6>
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
            <Modal.Title>Edit About Me</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <p className="text-danger">
                Unable to update description. Check if you added invalid
                characters.
              </p>
            )}
            <textarea
              ref={textInputRef}
              id="text"
              value={aboutMeText}
              onChange={(e) => setAboutMeText(e.target.value)}
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
      <p className="mt-3 mb-0 talent-long-description">{aboutMeText}</p>
      {youtubeUrl && (
        <div className="talent-profile-video-player mt-3 mx-auto">
          <ReactPlayer url={youtubeUrl} light width={"100%"} height={"100%"} />
        </div>
      )}
    </div>
  );
};

const TalentDetail = ({
  profilePictureUrl,
  username,
  ticker,
  tags,
  linkedinUrl,
  allowEdit,
}) => {
  return (
    <div className="mb-3 mb-md-5 d-flex flex-column flex-md-row align-items-center">
      <TalentProfilePicture src={profilePictureUrl} height={96} />
      <div className="d-flex flex-column ml-2">
        <h1 className="h2">
          <small>
            {username} <span className="text-muted">({ticker})</span>
          </small>
        </h1>
        <TalentTags tags={tags} />
      </div>
      <div className="ml-md-auto d-flex flex-row-reverse flex-md-column justify-content-between align-items-end mt-2 mt-md-0">
        <a className="mt-0 mt-md-2" href={linkedinUrl}>
          <img
            src={LinkedInIcon}
            height={24}
            alt="LinkedIn Icon"
            className="greyscale-img"
          />
        </a>
      </div>
    </div>
  );
};

const TalentShow = ({ talent, careerGoal, rewards, currentUserId }) => {
  const talentIsFromCurrentUser = talent.userId == currentUserId;

  return (
    <div className="d-flex flex-column">
      <TalentDetail
        username={talent.username}
        profilePictureUrl={talent.profilePictureUrl}
        ticker={talent.ticker}
        tags={talent.tags}
        linkedinUrl={talent.linkedinUrl}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
      />
      <AboutMe
        description={talent.description}
        youtubeUrl={talent.youtubeUrl}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
      />
      <CareerGoals
        careerGoal={careerGoal}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
      />
      <Rewards
        rewards={rewards}
        ticker={talent.ticker}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
      />
    </div>
  );
};

export default TalentShow;

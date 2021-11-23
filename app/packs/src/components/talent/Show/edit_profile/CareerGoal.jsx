import React, { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { patch, post, destroy } from "src/utils/requests";

import Button from "../../../button";

const EditGoal = ({
  goals,
  career_goal,
  selectedGoal,
  setMode,
  updateSharedState,
}) => {
  const [saving, setSaving] = useState(false);
  const [destroying, setDestroying] = useState(false);
  const [goalInfo, setGoalInfo] = useState({
    id: selectedGoal.id || "",
    title: selectedGoal.title || "",
    due_date: selectedGoal.due_date || "",
    description: selectedGoal.description || "",
  });

  const changeAttribute = (attribute, value) => {
    setGoalInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const handleDestroy = async (e) => {
    e.preventDefault();
    setDestroying(true);
    const response = await destroy(
      `/api/v1/career_goal/${career_goal.id}/goals/${goalInfo["id"]}`
    ).catch(() => setDestroying(false));

    if (response) {
      const goalIndex = goals.findIndex((goal) => goal.id == goalInfo["id"]);
      let newGoals = [...goals];
      if (goalIndex > -1) {
        newGoals.splice(goalIndex, 1);
      }

      updateSharedState((prevState) => ({
        ...prevState,
        goals: newGoals,
      }));
    }

    setDestroying(false);
    setMode("view");
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setMode("view");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let requestType, url;
    if (goalInfo["id"] != "") {
      requestType = patch;
      url = `/api/v1/career_goals/${career_goal.id}/goals/${goalInfo["id"]}`;
    } else {
      requestType = post;
      url = `/api/v1/career_goals/${career_goal.id}/goals`;
    }

    const response = await requestType(url, {
      goal: {
        due_date: goalInfo["due_date"],
        description: goalInfo["description"],
        title: goalInfo["title"],
      },
    }).catch(() => setSaving(false));

    if (response) {
      const goalIndex = goals.findIndex((goal) => goal.id == goalInfo["id"]);
      let newGoals = [...goals];
      if (goalIndex > -1) {
        newGoals.splice(goalIndex, 1);
      }

      newGoals.push(response);
      newGoals.sort((fItem, lItem) => {
        if (fItem.due_date > lItem.due_date) {
          return 1;
        } else if (fItem.due_date < lItem.due_date) {
          return -1;
        }
        return 0;
      });

      updateSharedState((prevState) => ({
        ...prevState,
        goals: newGoals,
      }));
    }

    setSaving(false);
    setMode("view");
  };

  const allowSave = () =>
    goalInfo["title"] != "" &&
    goalInfo["description"] != "" &&
    goalInfo["due_date"] != "";

  return (
    <form>
      <h5>Goal</h5>
      <div className="form-group">
        <div className="d-flex flex-row justify-content-between">
          <label htmlFor="title">Title *</label>
          <label htmlFor="title">
            <small className="text-muted">
              {goalInfo["title"]?.length || 0} of 45
            </small>
          </label>
        </div>
        <input
          id="title"
          className="form-control"
          maxLength={45}
          placeholder="What is your goal"
          value={goalInfo["title"]}
          onChange={(e) => changeAttribute("title", e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className="d-flex flex-row justify-content-between">
          <label htmlFor="description">Description *</label>
          <label htmlFor="description">
            <small className="text-muted">
              {goalInfo["description"]?.length || 0} of 175
            </small>
          </label>
        </div>
        <textarea
          rows="7"
          id="description"
          className="form-control"
          maxLength={175}
          placeholder="Describe your goal"
          value={goalInfo["description"]}
          onChange={(e) => changeAttribute("description", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Due Date *</label>
        <input
          id="due_date"
          type="date"
          className="form-control"
          aria-describedby="due_date_help"
          value={goalInfo["due_date"]}
          onChange={(e) => changeAttribute("due_date", e.target.value)}
        />
        <small id="due_date_help" className="form-text text-muted">
          When you expect to reach your goal
        </small>
      </div>
      <p className="my-3">* Field is required.</p>
      <div className="mb-2 d-flex flex-row-reverse align-items-end">
        <button
          disabled={saving || !allowSave()}
          onClick={handleSave}
          className="btn btn-primary talent-button ml-2"
        >
          {saving ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin /> Saving
            </>
          ) : (
            "Save"
          )}
        </button>
        <Button type="secondary" text="Cancel" onClick={handleCancel} />
        {goalInfo["id"] != "" && (
          <button
            disabled={destroying}
            onClick={handleDestroy}
            className="btn btn-danger talent-button mr-2"
          >
            {destroying ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Delete
              </>
            ) : (
              "Delete"
            )}
          </button>
        )}
      </div>
    </form>
  );
};

const ViewGoals = ({ goals, setSelectedGoal, setMode }) => {
  return (
    <div className="d-flex flex-column mt-3">
      <div className="d-flex flex-row justify-content-between">
        <h5>Roadmap</h5>
        <Button type="primary" text="Add goal" onClick={setMode} />
      </div>
      {goals.length == 0 && (
        <small className="text-muted">
          Start by adding what was your first goal!
        </small>
      )}
      {goals.map((goal) => {
        return (
          <button
            key={`career_goal_${goal.id}`}
            className="btn btn-outline-secondary w-100 rounded-0 text-left mt-2"
            onClick={() => setSelectedGoal(goal)}
          >
            <div className="d-flex flex-row w-100 justify-content-end">
              <small>{goal.due_date}</small>
            </div>
            <h5 className="mb-1">{goal.title}</h5>
            <p className="mb-1">{goal.description}</p>
          </button>
        );
      })}
    </div>
  );
};

const CareerGoal = (props) => {
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState("view");
  const [careerInfo, setCareerInfo] = useState({
    id: props.career_goal?.id || "",
    bio: props.career_goal?.bio || "",
    pitch: props.career_goal?.pitch || "",
    challenges: props.career_goal?.challenges || "",
  });
  const [selectedGoal, setSelectedGoal] = useState({});

  const selectGoal = (goal) => {
    setSelectedGoal(goal);
    setMode("edit");
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setSelectedGoal({});
  };

  const changeAttribute = (attribute, value) => {
    setCareerInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    let requestType, url;

    if (careerInfo["id"] != "") {
      requestType = patch;
      url = `/api/v1/talent/${props.talent.id}/career_goals/${careerInfo["id"]}`;
    } else {
      requestType = post;
      url = `/api/v1/talent/${props.talent.id}/career_goals`;
    }

    const response = await requestType(url, {
      career_goal: {
        bio: careerInfo["bio"],
        pitch: careerInfo["pitch"],
        challenges: careerInfo["challenges"],
      },
    }).catch(() => setSaving(false));

    if (response) {
      props.updateSharedState((prevState) => ({
        ...prevState,
        career_goal: {
          ...prevState.career_goal,
          bio: careerInfo["bio"],
          pitch: careerInfo["pitch"],
          challenges: careerInfo["challenges"],
        },
      }));
    }

    setSaving(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    close();
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h4>Goals</h4>
      </div>
      {mode == "view" && (
        <form>
          <div className="form-group">
            <div className="d-flex flex-row justify-content-between">
              <label htmlFor="pitch">Pitch *</label>
              <label htmlFor="pitch">
                <small className="text-muted">
                  {careerInfo["pitch"]?.length || 0} of 400
                </small>
              </label>
            </div>
            <textarea
              id="pitch"
              rows="6"
              maxLength={400}
              className="form-control"
              placeholder="Your long term ambition, why do you have potential"
              onChange={(e) => changeAttribute("pitch", e.target.value)}
              value={careerInfo["pitch"]}
            />
          </div>
          <div className="form-group">
            <div className="d-flex flex-row justify-content-between">
              <label htmlFor="challenges">Challenges *</label>
              <label htmlFor="challenges">
                <small className="text-muted">
                  {careerInfo["challenges"]?.length || 0} of 175
                </small>
              </label>
            </div>
            <textarea
              id="challenges"
              rows="7"
              maxLength={175}
              className="form-control"
              placeholder="What do you need support with"
              onChange={(e) => changeAttribute("challenges", e.target.value)}
              value={careerInfo["challenges"]}
            />
          </div>
          <p className="my-3">* Field is required.</p>
          <div className="mb-2 d-flex flex-row-reverse align-items-end justify-content-between">
            <button
              type="submit"
              disabled={saving}
              onClick={handleSave}
              className="btn btn-primary talent-button"
            >
              {saving ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Saving
                </>
              ) : (
                "Save"
              )}
            </button>
            <Button type="secondary" text="Cancel" onClick={handleCancel} />
          </div>
        </form>
      )}
      {mode == "edit" && (
        <EditGoal {...props} selectedGoal={selectedGoal} setMode={changeMode} />
      )}
      {mode == "view" && (
        <ViewGoals
          {...props}
          setMode={() => setMode("edit")}
          setSelectedGoal={selectGoal}
        />
      )}
    </div>
  );
};

export default CareerGoal;

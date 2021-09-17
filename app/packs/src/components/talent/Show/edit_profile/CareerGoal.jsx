import React, { useState } from "react";

import { patch } from "src/utils/requests";

import Button from "../../../button";

const EditCareerGoal = () => {
  const [careerGoalInfo, setCareerGoalInfo] = useState({
    due_date: "",
    goal: "",
  });

  const changeAttribute = (attribute, value) => {
    setCareerGoalInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  return (
    <form>
      <div className="form-group">
        <label htmlFor="title">Goal</label>
        <textarea
          rows="3"
          id="goal"
          className="form-control"
          placeholder="Describe your goal"
          value={careerGoalInfo["goal"]}
          onChange={(e) => changeAttribute("goal", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="title">Due Date</label>
        <input
          id="due_date"
          type="date"
          className="form-control"
          aria-describedby="due_date_help"
          value={careerGoalInfo["due_date"]}
          onChange={(e) => changeAttribute("due_date", e.target.value)}
        />
        <small id="due_date_help" className="form-text text-muted">
          When you expect to reach your goal
        </small>
      </div>
      <div className="mb-2 d-flex flex-row align-items-end justify-content-between">
        <Button type="secondary" text="Cancel" onClick={() => null} />
        <Button type="primary" text="Save" onClick={() => null} />
      </div>
    </form>
  );
};

const ViewCareerGoals = () => {
  const career_goals = { 1: { id: 1, goal: "hello", due_date: "11/11/11" } };

  return (
    <div className="d-flex flex-column mt-3">
      <p>Goals</p>
      {Object.keys(career_goals).length == 0 && (
        <small className="text-muted">Start by creating your first goal!</small>
      )}
      {Object.keys(career_goals).map((career_goal_id) => {
        return (
          <button
            key={`career_goal_${career_goal_id}`}
            className="btn btn-outline-secondary w-100 rounded-0 text-left"
          >
            <div className="d-flex flex-row w-100 justify-content-end">
              <small>{career_goals[career_goal_id].due_date}</small>
            </div>
            <p className="mb-1">{career_goals[career_goal_id].goal}</p>
          </button>
        );
      })}
    </div>
  );
};

const CareerGoal = () => {
  const [mode, setMode] = useState("view");
  const [careerInfo, setCareerInfo] = useState({
    bio: "",
    pitch: "",
    challenges: "",
  });

  const changeAttribute = (attribute, value) => {
    setCareerInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h4>Career Goal</h4>
        {mode != "edit" && (
          <Button
            type="primary"
            text="Add Goal"
            onClick={() => setMode("edit")}
          />
        )}
      </div>
      {mode == "view" && (
        <form>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <input
              id="bio"
              className="form-control"
              placeholder="A short bio"
              value={careerInfo["bio"]}
              onChange={(e) => changeAttribute("bio", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pitch">Pitch</label>
            <textarea
              id="pitch"
              className="form-control"
              placeholder="Your long term ambition, why do you have potential"
              onChange={(e) => changeAttribute("pitch", e.target.value)}
              value={careerInfo["pitch"]}
            />
          </div>
          <div className="form-group">
            <label htmlFor="challenge">Challenges</label>
            <textarea
              id="pitch"
              className="form-control"
              placeholder="What do you need support with"
              onChange={(e) => changeAttribute("challenges", e.target.value)}
              value={careerInfo["challenges"]}
            />
          </div>
        </form>
      )}
      {mode == "view" && <ViewCareerGoals />}
      {mode == "edit" && <EditCareerGoal />}
    </div>
  );
};

export default CareerGoal;

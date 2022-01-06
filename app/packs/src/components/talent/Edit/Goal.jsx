import React, { useState } from "react";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import Button from "src/components/design_system/button";
import RoadmapCard from "src/components/design_system/cards/roadmap";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight, ArrowLeft } from "src/components/icons";

const Goal = ({ railsContext, mode, ...props }) => {
  const { career_goal, talent, mobile, goals, changeTab } = props;
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [goalInfo, setGoalInfo] = useState({
    id: "",
    title: "",
    date: "",
    description: "",
  });
  const [careerInfo, setCareerInfo] = useState({
    id: career_goal?.id || "",
    bio: career_goal?.bio || "",
    pitch: career_goal?.pitch || "",
    challenges: career_goal?.challenges || "",
    video: talent.profile.video || "",
  });

  const changeAttribute = (attribute, value) => {
    setCareerInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };
  const changeGoalAttribute = (attribute, value) => {
    setGoalInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const changeGoal = (id) => {
    setCareerInfo(id);

    const selectedGoal = goals.find((goal) => goal.id == id);

    setCareerInfo({
      id: "",
      title: "",
      due_date: "",
      description: "",
    });
  };

  return (
    <>
      <H5 className="w-100 text-left" mode={mode} text="Pitch" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Talk directly to your sponsors"
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Pitch"}
          mode={mode}
          onChange={(e) => changeAttribute("pitch", e.target.value)}
          value={careerInfo["pitch"]}
          className="w-100"
          maxLength="400"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Pitch video"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeAttribute("video", e.target.value)}
          value={careerInfo["video"]}
          className={"w-100"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Challenges"}
          mode={mode}
          onChange={(e) => changeAttribute("challenges", e.target.value)}
          value={careerInfo["challenges"]}
          className="w-100"
          shortCaption={
            "What are your challenges? This is where sponsors can help you!"
          }
          maxLength="175"
        />
      </div>
      <div className={`divider ${mode} my-3`}></div>
      <H5 className="w-100 text-left" mode={mode} text="Roadmap" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Start by adding what is your first goal"
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Title"}
          mode={mode}
          shortCaption={"What's your goal"}
          onChange={(e) => changeGoalAttribute("title", e.target.value)}
          value={goalInfo["title"]}
          className={"w-100"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Description"}
          mode={mode}
          onChange={(e) => changeGoalAttribute("description", e.target.value)}
          value={goalInfo["description"]}
          className="w-100"
          shortCaption={"Describe your goal"}
          maxLength="175"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3 flex-wrap">
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 pr-2"}`}>
          <h6 className={`title-field ${mode}`}>Due Date</h6>
          <input
            className={`form-control ${mode}`}
            placeholder={"Select date"}
            type="date"
            value={goalInfo["due_date"]}
            onChange={(e) => changeGoalAttribute("due_date", e.target.value)}
          />
        </div>
      </div>
      <Button
        onClick={() => console.log("saving")}
        type="white-ghost"
        mode={mode}
        className="text-primary w-100 mt-3"
      >
        + Add another Goal
      </Button>
      {goals.map((goal, index) => (
        <RoadmapCard
          key={`goal_list_${goal.id}`}
          className={`w-100 mt-3 ${mobile ? "remove-background p-0" : ""}`}
          mode={mode}
          due_date={goal.due_date}
          title={goal.title}
          description={goal.description}
          onClick={() => changeGoal(goal.id)}
        />
      ))}
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Highlights")}
            >
              <ArrowLeft color="currentColor" /> Highlights
            </div>
          </div>
          <div className="d-flex flex-column">
            <Caption text="NEXT" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Token")}
            >
              Token <ArrowRight color="currentColor" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Goal;

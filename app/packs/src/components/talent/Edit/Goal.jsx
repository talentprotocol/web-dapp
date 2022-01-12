import React, { useState } from "react";

import { destroy, patch, post } from "src/utils/requests";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import Button from "src/components/design_system/button";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight, ArrowLeft, Delete } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";

const emptyGoal = (id) => ({
  id: id,
  title: "",
  due_date: "",
  description: "",
});

const GoalForm = ({
  goal,
  changeAttribute,
  showAddNew,
  mobile,
  mode,
  removeGoal,
  validationErrors,
  addGoal,
}) => {
  return (
    <>
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Title"}
          mode={mode}
          shortCaption={"What's your goal"}
          onChange={(e) => changeAttribute("title", e.target.value)}
          value={goal["title"]}
          className={"w-100"}
          required={true}
          error={validationErrors?.title}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Description"}
          mode={mode}
          onChange={(e) => changeAttribute("description", e.target.value)}
          value={goal["description"]}
          className="w-100"
          shortCaption={"Describe your goal"}
          maxLength="175"
          required={true}
          error={validationErrors?.description}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3 flex-wrap">
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 pr-2"}`}>
          <h6 className={`title-field ${mode}`}>
            Due Date <span className="text-danger">*</span>
          </h6>
          <input
            className={`form-control ${mode} ${
              validationErrors?.due_date ? "border-danger" : ""
            }`}
            placeholder={"Select date"}
            type="date"
            value={goal["due_date"]}
            onChange={(e) => changeAttribute("due_date", e.target.value)}
          />
        </div>
        {!showAddNew && (
          <Button
            onClick={() => removeGoal(goal["id"])}
            type="white-ghost"
            mode={mode}
          >
            <Delete color="currentColor" />
          </Button>
        )}
      </div>
      {showAddNew && (
        <Button
          onClick={addGoal}
          type="white-ghost"
          mode={mode}
          className="text-primary w-100 my-3"
        >
          + Add another Goal
        </Button>
      )}
      <div className={`divider ${mode} my-3`}></div>
    </>
  );
};

const arrayToObject = (inputArray) => {
  const obj = {};

  inputArray.forEach((element) => (obj[element.id] = element));

  return obj;
};

const Goal = (props) => {
  const {
    career_goal,
    mode,
    togglePublicProfile,
    publicButtonType,
    disablePublicButton,
    talent,
    mobile,
    goals,
    changeTab,
    changeSharedState,
  } = props;
  const [allGoals, setAllGoals] = useState({
    new: emptyGoal("new"),
    ...arrayToObject(goals),
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [hasChanges, setHasChanges] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });

  const [careerInfo, setCareerInfo] = useState({
    id: career_goal?.id || "",
    bio: career_goal?.bio || "",
    pitch: career_goal?.pitch || "",
    challenges: career_goal?.challenges || "",
    video: talent.profile.video || "",
  });

  const changeCareerAttribute = (attribute, value) => {
    if (hasChanges.career != true) {
      setHasChanges((prev) => ({ ...prev, career: true }));
    }
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }

    setCareerInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const changeAttribute = (key, attribute, value) => {
    if (Object.keys(validationErrors).length > 0) {
      setValidationErrors({});
    }

    if (key != "new" && hasChanges[key] != true) {
      setHasChanges((prev) => ({ ...prev, [key]: true }));
    }

    setAllGoals((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [attribute]: value,
      },
    }));
  };

  const sortAllGoalKeys = (key1, key2) => {
    if (key1.includes("new")) {
      if (key2.includes("new")) {
        return key1.length > key2.length ? -1 : 1;
      } else {
        return -1;
      }
    } else if (key2.includes("new")) {
      return -1;
    } else {
      return parseInt(key1) > parseInt(key2) ? -1 : 1;
    }
  };

  const goalValid = (id) => {
    const errors = {};
    if (allGoals[id].title == "") {
      errors["title"] = true;
    }
    if (allGoals[id].due_date == "") {
      errors["due_date"] = true;
    }
    if (allGoals[id].description == "") {
      errors["description"] = true;
    }
    return errors;
  };

  const addGoal = async (id) => {
    const errors = goalValid(id);

    if (Object.keys(errors).length == 0) {
      // add new goal and reset

      let requestType, url;
      if (id != "new") {
        requestType = patch;
        url = `/api/v1/career_goals/${career_goal.id}/goals/${id}`;
      } else {
        requestType = post;
        url = `/api/v1/career_goals/${career_goal.id}/goals`;
      }

      const response = await requestType(url, {
        goal: {
          ...allGoals[id],
        },
      }).catch(() =>
        setValidationErrors((prev) => ({ ...prev, saving: true }))
      );

      if (response) {
        // update local state
        const newGoals = { ...allGoals };
        newGoals[response.id] = response;
        setAllGoals(newGoals);
        setHasChanges((prev) => ({ ...prev, id: false }));

        // update global state
        let newGoalsProps = [...goals];
        const goalsIndex = goals.findIndex((goal) => goal.id == response["id"]);

        if (goalsIndex > -1) {
          newGoalsProps.splice(goalsIndex, 1);
        }

        newGoalsProps.push(response);

        changeSharedState((prevState) => ({
          ...prevState,
          goals: newGoalsProps,
        }));
      }
    } else {
      setValidationErrors((prev) => ({ ...prev, [id]: errors }));
    }
  };

  const removeGoal = async (id) => {
    let response;
    if (typeof id == "number") {
      response = await destroy(
        `/api/v1/career_goals/${career_goal.id}/goals/${id}`
      ).catch(() =>
        setValidationErrors((prev) => ({ ...prev, removing: true }))
      );
    } else {
      response = true;
    }

    if (response) {
      setHasChanges((prev) => ({ ...prev, id: false }));
      const goalIndex = goals.findIndex((goal) => goal.id == id);
      let newGoals = [...goals];
      if (goalIndex > -1) {
        newGoals.splice(goalIndex, 1);
      }

      changeSharedState((prevState) => ({
        ...prevState,
        goals: newGoals,
      }));

      let updatedGoalState = { ...allGoals };
      delete updatedGoalState[id];
      setAllGoals(updatedGoalState);
    }
  };

  const careerValid = () => {
    const errors = {};
    if (careerInfo.bio == "") {
      errors["bio"] = true;
    }
    if (careerInfo.pitch == "") {
      errors["pitch"] = true;
    }
    if (careerInfo.challenges == "") {
      errors["challenges"] = true;
    }
    return errors;
  };

  const updateGoals = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));

    if (hasChanges["career"]) {
      const errors = careerValid();

      if (Object.keys(errors).length > 0) {
        setValidationErrors((prev) => ({
          ...prev,
          ...errors,
        }));
      }

      const response = await patch(
        `/api/v1/talent/${props.talent.id}/career_goals/${props.career_goal.id}`,
        {
          career_goal: {
            bio: careerInfo["bio"],
            pitch: careerInfo["pitch"],
            challenges: careerInfo["challenges"],
          },
          talent: {
            video: careerInfo["video"],
          },
        }
      ).catch(() => setValidationErrors((prev) => ({ ...prev, career: true })));

      if (response) {
        setHasChanges((prev) => ({ ...prev, career: false }));

        changeSharedState((prev) => ({
          ...prev,
          career_goal: {
            ...prev.career_goal,
            bio: careerInfo["bio"],
            pitch: careerInfo["pitch"],
            challenges: careerInfo["challenges"],
          },
          talent: {
            ...prev.talent,
            profile: {
              ...prev.talent.profile,
              video: careerInfo["video"],
            },
          },
        }));
      }
    }

    const ids = Object.keys(hasChanges).filter(
      (id) => hasChanges[id] && id != "career"
    );

    ids.forEach((id) => addGoal(id));

    setSaving((prev) => ({ ...prev, loading: false, profile: true }));
  };

  const onTogglePublic = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await togglePublicProfile();
    setSaving((prev) => ({ ...prev, loading: false, public: true }));
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
          onChange={(e) => changeCareerAttribute("pitch", e.target.value)}
          value={careerInfo["pitch"]}
          className="w-100"
          maxLength="400"
          required={true}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Pitch video"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeCareerAttribute("video", e.target.value)}
          value={careerInfo["video"]}
          className={"w-100"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Challenges"}
          mode={mode}
          onChange={(e) => changeCareerAttribute("challenges", e.target.value)}
          value={careerInfo["challenges"]}
          className="w-100"
          shortCaption={
            "What are your challenges? This is where sponsors can help you!"
          }
          maxLength="175"
          required={true}
        />
      </div>
      <div className={`divider ${mode} my-3`}></div>
      <H5 className="w-100 text-left" mode={mode} text="Roadmap" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Start by adding what is your first goal"
      />
      {Object.keys(allGoals)
        .sort(sortAllGoalKeys)
        .map((currentGoal, index) => (
          <GoalForm
            key={`goal-list-${allGoals[currentGoal].id}`}
            goal={allGoals[currentGoal]}
            changeAttribute={(attribute, value) =>
              changeAttribute(currentGoal, attribute, value)
            }
            showAddNew={index == 0}
            mode={mode}
            mobile={mobile}
            removeGoal={removeGoal}
            addGoal={() => addGoal("new")}
            validationErrors={validationErrors[allGoals[currentGoal].id]}
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
      <div
        className={`d-flex flex-row ${
          mobile ? "justify-content-between" : "justify-content-end"
        } w-100`}
      >
        {mobile && (
          <LoadingButton
            onClick={() => onTogglePublic()}
            type={publicButtonType}
            mode={mode}
            disabled={disablePublicButton || saving["loading"]}
            loading={saving["loading"]}
            success={saving["public"]}
            className="ml-auto mr-3"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </LoadingButton>
        )}
        <LoadingButton
          onClick={() => updateGoals()}
          type="white-subtle"
          mode={mode}
          disabled={saving["loading"]}
          loading={saving["loading"]}
          success={saving["profile"]}
          className="text-black"
        >
          Save Profile
        </LoadingButton>
      </div>
    </>
  );
};

export default Goal;

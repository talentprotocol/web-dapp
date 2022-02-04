import React, { useState } from "react";
import dayjs from "dayjs";
import { destroy, patch, post } from "src/utils/requests";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import Button from "src/components/design_system/button";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight, ArrowLeft, Delete } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";
import Link from "src/components/design_system/link";
import Divider from "src/components/design_system/other/Divider";

import cx from "classnames";

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
      <div className="d-flex flex-row align-items-center justify-content-between mt-4">
        <TextInput
          title={"Title"}
          mode={mode}
          shortCaption="What's your goal"
          onChange={(e) => changeAttribute("title", e.target.value)}
          value={goal["title"]}
          className="edit-profile-input"
          required={true}
          error={validationErrors?.title}
        />
        {!showAddNew && (
          <Button
            onClick={() => removeGoal(goal["id"])}
            type="white-ghost"
            size="icon"
            className={cx(mobile && "ml-1")}
          >
            <Delete color="currentColor" />
          </Button>
        )}
      </div>
      <div className="d-flex flex-row justify-content-between mt-4">
        <TextArea
          title={"Description"}
          mode={mode}
          onChange={(e) => changeAttribute("description", e.target.value)}
          value={goal["description"]}
          className="edit-profile-input"
          shortCaption={"Describe your goal"}
          maxLength="175"
          required={true}
          error={validationErrors?.description}
          rows={3}
        />
      </div>
      <div className="d-flex flex-row justify-content-between mt-4">
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 pr-2"}`}>
          <h6 className={`title-field ${mode}`}>
            Due Date <span className="text-danger">*</span>
          </h6>
          <input
            className={`form-control ${mode} ${
              validationErrors?.due_date ? "border-danger" : ""
            }`}
            placeholder={"Select date"}
            type="month"
            value={goal["due_date"]}
            onChange={(e) => changeAttribute("due_date", e.target.value)}
          />
          <p className={`short-caption ${mode}`}>MM/YYYY</p>
        </div>
      </div>
      {showAddNew && (
        <button className="button-link w-100 mt-4 mb-2" onClick={addGoal}>
          <Link text="Add Goal" className="text-primary" />
        </button>
      )}
      <Divider className="my-4" />
    </>
  );
};

const arrayToObject = (inputArray) => {
  const obj = {};

  inputArray.forEach((element) => {
    obj[element.id] = element;
    obj[element.id]["due_date"] = dayjs(element.due_date).format("YYYY-MM");
  });

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

    if (hasChanges[key] != true) {
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
      return 1;
    } else {
      const key1Date = dayjs(allGoals[key1].due_date);
      const key2Date = dayjs(allGoals[key2].due_date);
      if (key1Date.isAfter(key2Date)) {
        return 1;
      } else {
        return -1;
      }
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
        newGoals[response.id] = {
          ...response,
          due_date: dayjs(response.due_date).format("YYYY-MM"),
        };

        if (id == "new") {
          newGoals["new"] = emptyGoal("new");
        }
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
      if (Object.keys(errors).length != 3 || id != "new") {
        // the condition above makes sure it isn't an empty new goal that is causing the validation to fail

        setValidationErrors((prev) => ({ ...prev, [id]: errors }));
      }
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
      <div className="d-flex flex-row justify-content-between mt-4">
        <TextArea
          title={"Pitch"}
          mode={mode}
          onChange={(e) => changeCareerAttribute("pitch", e.target.value)}
          value={careerInfo["pitch"]}
          className="edit-profile-input"
          maxLength="400"
          required={true}
          rows={3}
        />
      </div>
      <div className="d-flex flex-row justify-content-between mt-4">
        <TextInput
          title={"Pitch video"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeCareerAttribute("video", e.target.value)}
          value={careerInfo["video"]}
          className="edit-profile-input"
        />
      </div>
      <div className="d-flex flex-row justify-content-between mt-4">
        <TextArea
          title={"Challenges"}
          mode={mode}
          onChange={(e) => changeCareerAttribute("challenges", e.target.value)}
          value={careerInfo["challenges"]}
          className="edit-profile-input"
          shortCaption={
            "What are your challenges? This is where sponsors can help you!"
          }
          maxLength="175"
          rows={3}
        />
      </div>
      <Divider className="my-4" />
      <H5 className="w-100 text-left" mode={mode} text="Roadmap" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Start by adding what is your first goal"
      />
      {Object.keys(allGoals)
        .sort(sortAllGoalKeys)
        .map((currentGoalKey) => (
          <GoalForm
            key={`goal-list-${allGoals[currentGoalKey].id}`}
            goal={allGoals[currentGoalKey]}
            changeAttribute={(attribute, value) =>
              changeAttribute(currentGoalKey, attribute, value)
            }
            showAddNew={currentGoalKey == Object.keys(allGoals).at(-1)}
            mode={mode}
            mobile={mobile}
            removeGoal={removeGoal}
            addGoal={() => addGoal("new")}
            validationErrors={validationErrors[allGoals[currentGoalKey].id]}
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
          mobile ? "justify-content-between" : ""
        } w-100 pb-4`}
      >
        {mobile && (
          <LoadingButton
            onClick={() => onTogglePublic()}
            type={publicButtonType}
            mode={mode}
            disabled={disablePublicButton || saving["loading"]}
            loading={saving["loading"]}
            success={props.talent.public}
            className="ml-auto mr-3"
            checkClassName="edit-profile-public-check"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </LoadingButton>
        )}
        <LoadingButton
          onClick={() => updateGoals()}
          type="primary-default"
          mode={mode}
          disabled={saving["loading"]}
          loading={saving["loading"]}
          success={saving["profile"]}
        >
          Save Profile
        </LoadingButton>
      </div>
    </>
  );
};

export default Goal;

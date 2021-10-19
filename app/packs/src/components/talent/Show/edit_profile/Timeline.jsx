import React, { useState } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { patch, post, destroy } from "src/utils/requests";

import Button from "../../../button";

const EditMilestone = ({
  talent,
  selectedMilestone,
  setMode,
  milestones,
  updateSharedState,
}) => {
  const [saving, setSaving] = useState(false);
  const [destroying, setDestroying] = useState(false);
  const [milestoneInfo, setMilestoneInfo] = useState({
    id: selectedMilestone.id || "",
    title: selectedMilestone.title || "",
    start_date: selectedMilestone.start_date || "",
    institution: selectedMilestone.institution || "",
    description: selectedMilestone.description || "",
    link: selectedMilestone.link || "",
  });

  const changeAttribute = (attribute, value) => {
    setMilestoneInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const handleDestroy = async (e) => {
    e.preventDefault();
    setDestroying(true);
    const response = await destroy(
      `/api/v1/talent/${talent.id}/milestones/${milestoneInfo["id"]}`
    ).catch(() => setDestroying(false));

    if (response) {
      const milestoneIndex = milestones.findIndex(
        (milestone) => milestone.id == milestoneInfo["id"]
      );
      let newMilestones = [...milestones];
      if (milestoneIndex > -1) {
        newMilestones.splice(milestoneIndex, 1);
      }

      updateSharedState((prevState) => ({
        ...prevState,
        milestones: newMilestones,
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
    if (milestoneInfo["id"] != "") {
      requestType = patch;
      url = `/api/v1/talent/${talent.id}/milestones/${milestoneInfo["id"]}`;
    } else {
      requestType = post;
      url = `/api/v1/talent/${talent.id}/milestones`;
    }

    const response = await requestType(url, {
      milestone: {
        title: milestoneInfo["title"],
        start_date: milestoneInfo["start_date"],
        institution: milestoneInfo["institution"],
        description: milestoneInfo["description"],
        link: milestoneInfo["link"],
      },
    }).catch(() => setSaving(false));

    if (response) {
      const milestoneIndex = milestones.findIndex(
        (milestone) => milestone.id == milestoneInfo["id"]
      );
      let newMilestones = [...milestones];
      if (milestoneIndex > -1) {
        newMilestones.splice(milestoneIndex, 1);
      }

      newMilestones.push(response);
      newMilestones.sort((fItem, lItem) => {
        if (fItem.id > lItem.id) {
          return 1;
        } else if (fItem.id < lItem.id) {
          return -1;
        }
        return 0;
      });

      updateSharedState((prevState) => ({
        ...prevState,
        milestones: newMilestones,
      }));
    }

    setSaving(false);
    setMode("view");
  };

  const allowSave = () =>
    milestoneInfo["title"] != "" &&
    milestoneInfo["institution"] != "" &&
    milestoneInfo["start_date"] != "" &&
    milestoneInfo["description"] != "" &&
    milestoneInfo["link"] != "";

  return (
    <form>
      <div className="form-group">
        <div className="d-flex flex-row justify-content-between">
          <label htmlFor="title">Title *</label>
          <label htmlFor="title">
            <small className="text-muted">
              {milestoneInfo["title"]?.length || 0} of 45
            </small>
          </label>
        </div>
        <input
          id="title"
          maxLength={45}
          className="form-control"
          placeholder="Your position or achievement"
          value={milestoneInfo["title"]}
          onChange={(e) => changeAttribute("title", e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className="d-flex flex-row justify-content-between">
          <label htmlFor="institution">Institution *</label>
          <label htmlFor="institution">
            <small className="text-muted">
              {milestoneInfo["institution"]?.length || 0} of 45
            </small>
          </label>
        </div>
        <input
          id="institution"
          maxLength={45}
          className="form-control"
          placeholder="Company, client or school"
          value={milestoneInfo["institution"]}
          onChange={(e) => changeAttribute("institution", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="year">Year *</label>
        <input
          id="start_date"
          type="date"
          className="form-control"
          value={milestoneInfo["start_date"]}
          onChange={(e) => changeAttribute("start_date", e.target.value)}
        />
      </div>
      <div className="form-group">
        <div className="d-flex flex-row justify-content-between">
          <label htmlFor="description">Description *</label>
          <label htmlFor="description">
            <small className="text-muted">
              {milestoneInfo["description"]?.length || 0} of 175
            </small>
          </label>
        </div>
        <textarea
          rows="7"
          id="description"
          maxLength={175}
          className="form-control"
          placeholder="Describe what you did"
          value={milestoneInfo["description"]}
          onChange={(e) => changeAttribute("description", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="link">Link *</label>
        <input
          id="link"
          className="form-control"
          placeholder="https://..."
          value={milestoneInfo["link"]}
          onChange={(e) => changeAttribute("link", e.target.value)}
        />
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
        {milestoneInfo["id"] != "" && (
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

const ViewMilestones = ({ milestones, setSelectedMilestone }) => {
  return (
    <div className="d-flex flex-column mt-3">
      {milestones.length == 0 && (
        <small className="text-muted">
          Start by adding your first milestones!
        </small>
      )}
      {milestones.map((milestone) => {
        return (
          <button
            key={`milestone_${milestone.id}`}
            className="btn btn-outline-secondary w-100 rounded-0 text-left mt-2"
            onClick={() => setSelectedMilestone(milestone)}
          >
            <div className="d-flex flex-row w-100 justify-content-between">
              <h5 className="mb-1">
                <a href={milestone.link} className="text-reset">
                  {milestone.title}
                </a>
              </h5>
              <small>{milestone.start_date}</small>
            </div>
            <small className="text-left">
              <i>{milestone.institution}</i>
            </small>
            <p className="mb-1">{milestone.description}</p>
          </button>
        );
      })}
    </div>
  );
};

const Timeline = (props) => {
  const [mode, setMode] = useState("view");
  const [selectedMilestone, setSelectedMilestone] = useState({});

  const selectMilestone = (milestone) => {
    setSelectedMilestone(milestone);
    setMode("edit");
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setSelectedMilestone({});
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <div className="d-flex flex-row justify-content-between align-items-center">
        <h4>Timeline</h4>
        {mode != "edit" && (
          <Button
            type="primary"
            text="Add Milestone"
            onClick={() => setMode("edit")}
          />
        )}
      </div>
      {mode == "edit" && (
        <EditMilestone
          {...props}
          selectedMilestone={selectedMilestone}
          setMode={changeMode}
        />
      )}
      {mode == "view" && (
        <ViewMilestones {...props} setSelectedMilestone={selectMilestone} />
      )}
    </div>
  );
};

export default Timeline;

import React, { useState } from "react";

import { patch } from "src/utils/requests";

import Button from "../../../button";

const EditTimeline = () => {
  const [timelineInfo, setTimelineInfo] = useState({
    title: "",
    year: "",
    institution: "",
    description: "",
    link: "",
  });

  const changeAttribute = (attribute, value) => {
    setTimelineInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  return (
    <form>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          className="form-control"
          placeholder="Your position or achievement"
          value={timelineInfo["title"]}
          onChange={(e) => changeAttribute("title", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="year">Year</label>
        <input
          id="year"
          type="month"
          className="form-control"
          value={timelineInfo["year"]}
          onChange={(e) => changeAttribute("year", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          rows="5"
          id="description"
          className="form-control"
          placeholder="Describe what you did"
          value={timelineInfo["description"]}
          onChange={(e) => changeAttribute("description", e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="link">Link</label>
        <input
          id="link"
          className="form-control"
          placeholder="https://..."
          value={timelineInfo["link"]}
          onChange={(e) => changeAttribute("link", e.target.value)}
        />
      </div>
      <div className="mb-2 d-flex flex-row align-items-end justify-content-between">
        <Button type="secondary" text="Cancel" onClick={() => null} />
        <Button type="primary" text="Save" onClick={() => null} />
      </div>
    </form>
  );
};

const ViewTimeline = () => {
  const timelines = {
    1: {
      id: 1,
      title: "Fullstack Developer",
      year: "1993",
      institution: "iCapital Network",
      description:
        "Lead a team of some people many times. Lead a team of some people many times Lead a team of some people many times",
      link: "https://icapitalnetwork.com",
    },
  };

  return (
    <div className="d-flex flex-column mt-3">
      {Object.keys(timelines).length == 0 && (
        <small className="text-muted">
          Start by creating your first service!
        </small>
      )}
      {Object.keys(timelines).map((timeline_id) => {
        return (
          <button
            key={`timeline_${timeline_id}`}
            className="btn btn-outline-secondary w-100 rounded-0 text-left"
          >
            <div className="d-flex flex-row w-100 justify-content-between">
              <h5 className="mb-1">
                <a href={timelines[timeline_id].link} className="text-reset">
                  {timelines[timeline_id].title}
                </a>
              </h5>
              <small>{timelines[timeline_id].year}</small>
            </div>
            <small className="text-left">
              <i>{timelines[timeline_id].institution}</i>
            </small>
            <p className="mb-1">{timelines[timeline_id].description}</p>
          </button>
        );
      })}
    </div>
  );
};

const Timeline = () => {
  const [mode, setMode] = useState("view");

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
      {mode == "edit" && <EditTimeline />}
      {mode == "view" && <ViewTimeline />}
    </div>
  );
};

export default Timeline;

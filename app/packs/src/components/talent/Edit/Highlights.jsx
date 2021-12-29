import React, { useState } from "react";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import Button from "src/components/design_system/button";

const Highlights = ({ railsContext, mode, ...props }) => {
  const { milestones, mobile } = props;
  const [selectedHighlightId, setSelectedHighlightId] = useState(null);
  const [highlight, setHighlight] = useState({
    id: "",
    title: "",
    type: "",
    start_date: "",
    end_date: "",
    institution: "",
    location: "",
    description: "",
    link: "",
  });

  const changeAttribute = (attribute, value) => {
    setHighlight((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const changeHighlight = (id) => {
    setSelectedHighlightId(id);

    const selectedMilestone = milestones.find(
      (milestone) => milestone.id == id
    );

    setHighlight({
      id: selectedMilestone.id,
      title: selectedMilestone.title,
      type: selectedMilestone.type,
      start_date: selectedMilestone.start_date,
      end_date: selectedMilestone.end_date,
      institution: selectedMilestone.institution,
      location: selectedMilestone.location,
      description: selectedMilestone.description,
      link: selectedMilestone.link,
    });
  };

  return (
    <>
      <H5 className="w-100 text-left" mode={mode} text="Highlights" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Highlight what you've done in the past."
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Highlight type"}
          mode={mode}
          placeholder={"Project, award, position..."}
          onChange={(e) => changeAttribute("type", e.target.value)}
          value={highlight["type"]}
          className={mobile ? "w-100 px-3" : "w-50 pr-2"}
        />
        <TextInput
          title={"Location"}
          mode={mode}
          placeholder={"City, country"}
          onChange={(e) => changeAttribute("location", e.target.value)}
          value={highlight["location"]}
          className={mobile ? "w-100 px-3" : "w-50 pl-2"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3 flex-wrap">
        <TextInput
          title={"Title"}
          mode={mode}
          shortCaption="Your position or achievement"
          onChange={(e) => changeAttribute("title", e.target.value)}
          value={highlight["title"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3 flex-wrap">
        <TextInput
          title={"Institution"}
          mode={mode}
          placeholder={"Company, Client, School, University..."}
          onChange={(e) => changeAttribute("institution", e.target.value)}
          value={highlight["institution"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Description"}
          mode={mode}
          shortCaption="Describe what you did"
          onChange={(e) => changeAttribute("headline", e.target.value)}
          value={highlight["description"]}
          className="w-100"
          maxLength="175"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3 flex-wrap">
        <div
          className={`d-flex flex-column ${
            mobile ? "w-100 px-3" : "w-50 pr-2"
          }`}
        >
          <h6 className={`title-field ${mode}`}>Start Date</h6>
          <input
            className={`form-control ${mode}`}
            placeholder={"Select date"}
            type="date"
            value={highlight["start_date"]}
            onChange={(e) => changeAttribute("start_date", e.target.value)}
          />
        </div>
        <div
          className={`d-flex flex-column ${
            mobile ? "w-100 px-3" : "w-50 pl-2"
          }`}
        >
          <h6 className={`title-field ${mode}`}>End Date</h6>
          <input
            className={`form-control ${mode}`}
            placeholder={"Select date"}
            type="date"
            value={highlight["end_date"]}
            onChange={(e) => changeAttribute("end_date", e.target.value)}
          />
        </div>
      </div>
      <Button
        onClick={() => console.log("saving")}
        type="white-ghost"
        mode={mode}
        className="text-primary w-100 mt-3"
      >
        + Add another Highlight
      </Button>
    </>
  );
};

export default Highlights;

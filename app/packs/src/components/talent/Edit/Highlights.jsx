import React, { useState, useMemo } from "react";
import dayjs from "dayjs";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import Button from "src/components/design_system/button";
import ProjectCard from "src/components/design_system/cards/project";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight, ArrowLeft } from "src/components/icons";

const Highlights = ({ railsContext, ...props }) => {
  const { milestones, mobile, changeTab, mode } = props;
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

  const sortedTimeline = useMemo(() => {
    return milestones.sort((first, second) => {
      const firstDate = dayjs(first.start_date);
      const secondDate = dayjs(second.start_date);

      if (firstDate.isAfter(secondDate)) {
        return -1;
      } else if (firstDate.isBefore(secondDate)) {
        return 1;
      }
      return 0;
    });
  }, [milestones]);

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
          className={mobile ? "w-100" : "w-50 pr-2"}
        />
        <TextInput
          title={"Location"}
          mode={mode}
          placeholder={"City, country"}
          onChange={(e) => changeAttribute("location", e.target.value)}
          value={highlight["location"]}
          className={mobile ? "w-100" : "w-50 pl-2"}
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
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 pr-2"}`}>
          <h6 className={`title-field ${mode}`}>Start Date</h6>
          <input
            className={`form-control ${mode}`}
            placeholder={"Select date"}
            type="date"
            value={highlight["start_date"]}
            onChange={(e) => changeAttribute("start_date", e.target.value)}
          />
        </div>
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 pl-2"}`}>
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
        className="text-primary w-100 my-3"
      >
        + Add another Highlight
      </Button>
      {sortedTimeline.map((milestone) => (
        <div
          key={`milestone_list_${milestone.id}`}
          className="d-flex flex-row w-100 mb-3 bg-light pb-3"
        >
          <div className="col-3 d-flex flex-column justify-content-center">
            <small>{milestone.start_date}</small>
          </div>
          <div className="col-9">
            <ProjectCard
              mode={mode}
              organization={milestone.institution}
              title={milestone.title}
              description={milestone.description}
              website_link={milestone.link}
            />
          </div>
        </div>
      ))}
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("About")}
            >
              <ArrowLeft color="currentColor" /> About
            </div>
          </div>
          <div className="d-flex flex-column">
            <Caption text="NEXT" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Goal")}
            >
              Goal <ArrowRight color="currentColor" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Highlights;

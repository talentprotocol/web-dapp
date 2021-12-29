import React, { useState } from "react";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";

const Highlights = ({ railsContext, mode, ...props }) => {
  const { milestones, mobile } = props;
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

  return (
    <>
      <H5
        className="w-100 text-left"
        mode={mode}
        text="Personal Information"
        bold
      />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Let's start with the basics"
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
          shortCaption="Your position or achievment"
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
        <TextInput
          title={"Start Date"}
          mode={mode}
          placeholder={"Select date"}
          onChange={(e) => changeAttribute("start_date", e.target.value)}
          value={highlight["start_date"]}
          className={mobile ? "w-100 px-3" : "w-50 pl-2"}
        />
        <TextInput
          title={"End Date"}
          mode={mode}
          placeholder={"Select date"}
          onChange={(e) => changeAttribute("end_date", e.target.value)}
          value={highlight["end_date"]}
          className={mobile ? "w-100 px-3" : "w-50 pl-2"}
        />
      </div>
    </>
  );
};

export default Highlights;

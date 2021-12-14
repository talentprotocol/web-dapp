import React from "react";
import Caption from "src/components/design_system/typography/caption";

const Roadmap = ({ mode, due_date, title, description }) => {
  return (
    <div className={`col-md-3 card ${mode}`}>
      <Caption
        className="roadmap-date text-uppercase"
        mode={`${mode}`}
        text={`${due_date}`}
      ></Caption>

      <Caption
        className="roadmap-title"
        mode={`${mode}`}
        text={`${title}`}
        bold="true"
      ></Caption>

      {description ? (
        <Caption
          className="roadmap-description"
          mode={`${mode}`}
          text={`${description}`}
        ></Caption>
      ) : null}
    </div>
  );
};

export default Roadmap;

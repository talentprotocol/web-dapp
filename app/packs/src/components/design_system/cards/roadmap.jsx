import React from "react";
import Caption from "src/components/design_system/typography/caption";

const Roadmap = ({ mode, due_date, title, description, className = "" }) => {
  return (
    <div className={`card ${mode} ${className}`}>
      <Caption
        className="roadmap-date text-uppercase text-primary"
        mode={`${mode}`}
        text={`${due_date}`}
      />
      <Caption
        className="roadmap-title"
        mode={`${mode}`}
        text={`${title}`}
        bold={true}
      />
      {description ? (
        <Caption
          className="roadmap-description"
          mode={`${mode}`}
          text={`${description}`}
        />
      ) : null}
    </div>
  );
};

export default Roadmap;

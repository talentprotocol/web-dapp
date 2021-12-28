import React from "react";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";

const About = ({ mode }) => {
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
        bold
      />
      <div className="d-flex flex-row"></div>
    </>
  );
};

export default About;

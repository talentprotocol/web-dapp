import React from "react";
import ReactPlayer from "react-player/youtube";

import Divider from "../../design_system/other/divider";
import { P1, P2, H5, Caption } from "src/components/design_system/typography";

const Overview = ({ sharedState, mode }) => {
  return (
    <>
      <section className="d-flex flex-row mt-4">
        {sharedState.user.username && (
          <Caption
            text={`@${sharedState.user.username}`}
            className="text-primary-03"
          />
        )}
        {sharedState.talent.profile.location && (
          <Caption
            text={sharedState.talent.profile.location}
            className="text-primary-03 ml-2"
          />
        )}
      </section>
      <section className="d-flex flex-column mt-3 mr-lg-5">
        {sharedState.talent.profile.headline && (
          <H5 bold className="text-black">
            {sharedState.talent.profile.headline}
          </H5>
        )}
        <Divider className="my-4" />
        <P1 mode={mode} text="Pitch" bold className="text-black" />
        {sharedState.careerGoal?.pitch && (
          <P2 mode={mode} text={sharedState.careerGoal?.pitch} />
        )}
        {sharedState.talent.profile.video && (
          <ReactPlayer
            url={sharedState.talent.profile.video}
            light
            width={"100%"}
          />
        )}
        <Divider className="my-4" />
        <P1 mode={mode} text="Challenges" bold className="mb-3 text-black" />
        {sharedState.careerGoal?.challenges && (
          <div className="d-flex flex-row w-100 align-items-center">
            <P2 mode={mode} text={sharedState.careerGoal?.challenges} />
          </div>
        )}
      </section>
    </>
  );
};

export default Overview;

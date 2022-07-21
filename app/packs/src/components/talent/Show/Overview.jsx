import React from "react";
import ReactPlayer from "react-player/youtube";

import Divider from "../../design_system/other/Divider";
import { P1, P2, H5, Caption } from "src/components/design_system/typography";

const emptyProfile = (profile, careerGoal) => {
  return !profile.headline && !careerGoal?.pitch && !careerGoal?.challenges;
};

const Overview = ({ user, profile, careerGoal, mode }) => {
  return (
    <>
      <section className="d-flex flex-row mt-4">
        {user.username && (
          <Caption text={`@${user.username}`} className="text-primary-03" />
        )}
        {profile.location && (
          <Caption text={profile.location} className="text-primary-03 ml-2" />
        )}
      </section>
      <section className="d-flex flex-column mt-3 mr-lg-5">
        {emptyProfile(profile, careerGoal) && (
          <>
            <H5>Oops, nothing here yet!</H5>
            <P2
              mode={mode}
              text={`It looks like ${user.username} is still working on it.`}
            />
          </>
        )}
        {profile.headline && (
          <H5 bold className="text-black">
            {profile.headline}
          </H5>
        )}
        {careerGoal?.pitch && (
          <>
            <Divider className="my-4" />
            <P1 mode={mode} text="Pitch" bold className="text-black" />
            <P2 mode={mode} text={careerGoal?.pitch} />
          </>
        )}
        {profile.video && (
          <ReactPlayer url={profile.video} light width={"100%"} />
        )}
        {careerGoal?.challenges && (
          <>
            <Divider className="my-4" />
            <P1
              mode={mode}
              text="Challenges"
              bold
              className="mb-3 text-black"
            />
            <div className="d-flex flex-row w-100 align-items-center">
              <P2 mode={mode} text={careerGoal?.challenges} />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Overview;

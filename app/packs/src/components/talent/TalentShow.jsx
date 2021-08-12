import React from "react";

import CareerGoals from "./Show/CareerGoals";
import Rewards from "./Show/Rewards";
import AboutMe from "./Show/AboutMe";
import TalentDetail from "./Show/TalentDetail";

const TalentShow = ({
  talent,
  careerGoal,
  rewards,
  currentUserId,
  tokenDeployed,
}) => {
  const talentIsFromCurrentUser = talent.userId == currentUserId;

  return (
    <div className="d-flex flex-column">
      <TalentDetail
        username={talent.username}
        profilePictureUrl={talent.profilePictureUrl}
        ticker={talent.ticker}
        tags={talent.tags}
        linkedinUrl={talent.linkedinUrl}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
        tokenDeployed={tokenDeployed}
      />
      <AboutMe
        description={talent.description}
        youtubeUrl={talent.youtubeUrl}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
      />
      <CareerGoals
        careerGoal={careerGoal}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
      />
      <Rewards
        rewards={rewards}
        ticker={talent.ticker}
        allowEdit={talentIsFromCurrentUser}
        talentId={talent.id}
      />
    </div>
  );
};

export default TalentShow;

import React from "react";

import CareerGoals from "./Show/CareerGoals";
import Rewards from "./Show/Rewards";
import AboutMe from "./Show/AboutMe";
import TalentDetail from "./Show/TalentDetail";
import EditProfile from "./Show/EditProfile";

const TalentShow = ({
  talent,
  services,
  token,
  perks,
  milestones,
  current_user_id,
  token_live,
  user,
  profilePictureUrl,
  primary_tag,
  secondary_tags,
}) => {
  const talentIsFromCurrentUser = talent.user_id == current_user_id;

  return (
    <div className="d-flex flex-column">
      <EditProfile
        talent={talent}
        user={user}
        primary_tag={primary_tag}
        secondary_tags={secondary_tags}
        profilePictureUrl={profilePictureUrl}
        services={services}
        token={token}
        token_live={token_live}
        perks={perks}
        milestones={milestones}
      />
    </div>
  );
};

export default TalentShow;

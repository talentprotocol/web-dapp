import React, { useState } from "react";
import { patch, getAuthToken } from "src/utils/requests";

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
  const [publicProfile, setPublicProfile] = useState(talent.public);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const togglePublic = async () => {
    const response = await patch(`/talent/${talent.id}`, {
      talent: { public: !publicProfile },
    });
    if (response.error) {
      setError(true);
      setMessage("We had an issue updating your profile");
    } else {
      setError(false);
      setMessage(
        `Your profile is now ${!publicProfile ? "public" : "private"}`
      );
      setPublicProfile(!publicProfile);
    }
  };

  return (
    <div className="d-flex flex-column">
      {message !== "" && (
        <div
          className={`mt-2 alert alert-${
            error ? "danger" : "success"
          } talent-alert talent-alert-${error ? "danger" : "success"}`}
        >
          {message}
        </div>
      )}
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
      <button
        role="button"
        onClick={togglePublic}
        className="talent-button btn btn-warning"
      >
        Make {!publicProfile ? "public" : "private"}
      </button>
    </div>
  );
};

export default TalentShow;

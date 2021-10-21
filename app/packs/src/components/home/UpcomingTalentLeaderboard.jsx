import React from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TalentProfilePicture from "../talent/TalentProfilePicture";

const UpcomingTalentLeaderboard = ({ talents }) => {
  if (talents.length === 0) {
    return <></>;
  }

  return (
    <div className="d-flex flex-column bg-light px-3 py-4 mb-3">
      <div className="d-flex flex-row w-100 justify-content-between">
        <h6>Upcoming Talent</h6>
        <a className="text-reset" href="/talent">
          More{" "}
          <FontAwesomeIcon icon={faChevronRight} size="sm" className="ml-2" />
        </a>
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <small className="text-muted">TALENT</small>
      </div>
      {talents.map((talent) => (
        <div
          key={`upcoming_talent_leaderboard_${talent.id}`}
          className="d-flex flex-row mt-3 align-items-center"
        >
          <div className="d-flex flex-row align-items-center">
            <TalentProfilePicture
              src={talent.profilePictureUrl}
              height={24}
              className="mr-3"
            />
            <a className="text-reset" href={`/talent/${talent.username}`}>
              <small>
                {talent.name}{" "}
                <span className="text-muted">{talent.ticker}</span>
              </small>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingTalentLeaderboard;

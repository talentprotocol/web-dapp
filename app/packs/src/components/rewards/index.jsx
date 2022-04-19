import React, { useState } from "react";

import { P3 } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";

import ReferralRace from "./ReferralRace";
import RewardsHeader from "./RewardsHeader";
import TalentInvites from "./TalentInvites";

const Tabs = ({ changeTab, activeTab, isTalent }) => {
  return (
    <div className="talent-table-tabs d-flex flex-row align-items-center overflow-x-scroll hide-scrollbar">
      <div
        onClick={() => changeTab("race")}
        className={`text-no-wrap talent-table-tab ml-4 ml-lg-0${
          activeTab == "race" ? " active-talent-table-tab" : ""
        }`}
      >
        Referral Race
      </div>
      <div
        onClick={() => changeTab("talent")}
        className={`text-no-wrap talent-table-tab${
          activeTab == "talent" ? " active-talent-table-tab" : ""
        }`}
      >
        Talent Invites
      </div>
      <div className="d-flex disabled-talent-table-tab">
        Quests
        <Tag className="ml-2">
          <P3 className="text-primary-04" bold text="Coming Soon" />
        </Tag>
      </div>
    </div>
  );
};

const Rewards = ({
  user,
  race,
  allRaces,
  rewards,
  talentInvites,
  talentList,
  supporterInvites,
  leaderboardResults,
}) => {
  const { isTalent, isEligible } = user;
  const [activeTab, changeTab] = useState("race");

  return (
    <>
      <RewardsHeader rewards={rewards} />
      <Tabs activeTab={activeTab} changeTab={changeTab} isTalent={isTalent} />
      {activeTab == "race" && (
        <ReferralRace
          race={race}
          allRaces={allRaces}
          supporterInvites={supporterInvites}
          currentRaceResults={user.currentRaceResults}
          isEligible={isEligible}
          leaderboardResults={leaderboardResults}
          isTalent={isTalent}
        />
      )}
      {activeTab == "talent" && (
        <TalentInvites
          username={user.username}
          invites={talentInvites}
          rewards={rewards}
          talentList={talentList}
          leaderboardResults={leaderboardResults}
          isTalent={isTalent}
        />
      )}
    </>
  );
};

export default Rewards;

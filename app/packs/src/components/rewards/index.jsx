import React, { useState } from "react";

import { P3 } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";

import ReferralRace from "./ReferralRace";
import RewardsHeader from "./RewardsHeader";
import TalentInvites from "./TalentInvites";

const Tabs = ({ changeTab, activeTab }) => {
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

const Rewards = ({ user, talentInvites, supporterInvites }) => {
  const { isTalent, isActiveSupporter } = user;
  const [activeTab, changeTab] = useState("race");

  return (
    <>
      <RewardsHeader rewards={user.rewards} />
      <Tabs activeTab={activeTab} changeTab={changeTab} />
      {activeTab == "race" && <ReferralRace />}
      {activeTab == "talent" && <TalentInvites />}
    </>
  );
};

export default Rewards;

import React, { useEffect, useState } from "react";

import { urlStore } from "src/contexts/state";

import { P3 } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";
import ReferralRace from "./ReferralRace";
import RewardsHeader from "./RewardsHeader";
import TalentInvites from "./TalentInvites";
import Quests from "./quests";

const Tabs = ({ changeTab, activeTab }) => {
  return (
    <div className="talent-table-tabs d-flex flex-row align-items-center overflow-x-scroll hide-scrollbar">
      <div
        onClick={() => changeTab("quests")}
        className={`d-flex align-items-center text-no-wrap talent-table-tab ml-4 ml-lg-0${
          activeTab == "quests" ? " active-talent-table-tab" : ""
        }`}
      >
        Quests
      </div>
      <div
        onClick={() => changeTab("talent")}
        className={`text-no-wrap talent-table-tab${
          activeTab == "talent" ? " active-talent-table-tab" : ""
        }`}
      >
        Talent Invites
      </div>
      <div
        onClick={() => changeTab("race")}
        className={`text-no-wrap talent-table-tab${
          activeTab == "race" ? " active-talent-table-tab" : ""
        }`}
      >
        Referral Race
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
  quests,
}) => {
  const changeURL = urlStore((state) => state.changeURL);

  const { isTalent, isEligible } = user;
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);
  const [activeTab, setTab] = useState("quests");
  const [questId, setQuestId] = useState(null);

  const changeTab = (tab) => {
    window.history.pushState({}, document.title, `${url.pathname}?tab=${tab}`);
    changeURL(new URL(document.location));
    setTab(tab);
    setQuestId(null);
  };

  useEffect(() => {
    if (searchParams.get("tab")) {
      setTab(searchParams.get("tab"));
    } else {
      window.history.replaceState(
        {},
        document.title,
        `${url.pathname}?tab=quests`
      );
    }
  }, [searchParams]);

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(document.location.search);
    if (document.location.search !== "") {
      setTab(params.get("tab"));
    }
  });

  return (
    <>
      <RewardsHeader rewards={rewards} />
      <Tabs activeTab={activeTab} changeTab={changeTab} />
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
      {activeTab == "quests" && (
        <Quests quests={quests} questId={questId} setQuestId={setQuestId} />
      )}
    </>
  );
};

export default (props, _railsContext) => {
  return () => <Rewards {...props} />;
};

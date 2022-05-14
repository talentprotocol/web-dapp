import React, { useEffect, useState } from "react";

import { urlStore } from "src/contexts/state";

import ReferralRace from "./ReferralRace";
import RewardsHeader from "./RewardsHeader";
import Invites from "./Invites";
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
        Invites
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
  racesCount,
  userRewards,
  raceRewards,
  talentInvites,
  talentList,
  supporterInvites,
  quests,
  raceRegisteredUsersCount,
  usersThatBoughtTokensCount,
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
      <RewardsHeader rewards={userRewards} />
      <Tabs activeTab={activeTab} changeTab={changeTab} />
      {activeTab == "race" && (
        <ReferralRace
          raceRewards={raceRewards}
          raceRegisteredUsersCount={raceRegisteredUsersCount}
          usersThatBoughtTokensCount={usersThatBoughtTokensCount}
          racesCount={racesCount}
          isEligible={isEligible}
          isTalent={isTalent}
        />
      )}
      {activeTab == "talent" && (
        <Invites
          username={user.username}
          talentInvites={talentInvites}
          supporterInvites={supporterInvites}
          talentList={talentList}
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

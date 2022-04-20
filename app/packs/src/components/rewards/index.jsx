import React, { useEffect, useState } from "react";

import ReferralRace from "./ReferralRace";
import RewardsHeader from "./RewardsHeader";
import TalentInvites from "./TalentInvites";
import Quests from "./quests";
import { ApolloProvider, client } from "src/utils/thegraph";
import { Provider, railsContextStore } from "src/contexts/state";

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
      <div
        onClick={() => changeTab("quests")}
        className={`text-no-wrap talent-table-tab${
          activeTab == "quests" ? " active-talent-table-tab" : ""
        }`}
      >
        Quests
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
  const { isTalent, isEligible } = user;
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);
  const [activeTab, setTab] = useState("race");
  const [questId, setQuestId] = useState(null);

  const changeTab = (tab) => {
    window.history.pushState({}, document.title, `${url.pathname}?tab=${tab}`);
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
        `${url.pathname}?tab=race`
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

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client(railsContext.contractsEnv)}>
      <Provider createStore={() => railsContextStore(railsContext)}>
        <Rewards {...props} railsContext={railsContext} />
      </Provider>
    </ApolloProvider>
  );
};

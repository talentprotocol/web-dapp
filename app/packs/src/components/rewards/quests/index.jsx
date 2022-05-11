import React, { useEffect } from "react";
import QuestCard from "src/components/design_system/cards/QuestCard";
import { H4, P1 } from "src/components/design_system/typography";
import { useWindowDimensionsHook } from "src/utils/window";
import QuestShow from "./show";

import cx from "classnames";

const Quests = ({ quests, questId, setQuestId }) => {
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);
  const { mobile } = useWindowDimensionsHook();

  useEffect(() => {
    if (searchParams.get("quest")) {
      setQuestId(searchParams.get("quest"));
    }
  }, [searchParams]);

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(document.location.search);
    setQuestId(params.get("quest"));
  });

  return (
    <div className="w-100 mt-6 mt-lg-7 pb-6">
      <div className="mb-6 mb-lg-6">
        <H4 bold text="Quests" className="text-black mb-3" />
        <P1
          text="Get to know Talent Protocol through investing in Talent, set up your profile and be rewarded"
          className="text-primary-03"
        />
      </div>
      <div
        className={cx(
          "d-flex flex-wrap",
          mobile ? "justify-content-center" : "justify-start"
        )}
      >
        {questId === null ? (
          <>
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={cx("quest-card", "mt-4", !mobile && "pr-4")}
              >
                <QuestCard
                  id={quest.id}
                  title={quest.title}
                  subtitle={quest.subtitle}
                  type={quest.type}
                  allTasks={quest.tasks.length}
                  completedTasks={
                    quest.tasks.filter((task) => task.status === "done").length
                  }
                  tasksType={quest.tasks.map((task) => task.type)}
                  status={quest.status}
                  user={quest.user}
                />
              </div>
            ))}
          </>
        ) : (
          <QuestShow questId={questId} />
        )}
      </div>
    </div>
  );
};

export default Quests;

import React, { useEffect } from "react";
import QuestCard from "src/components/design_system/cards/QuestCard";
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
    <div
      className={cx(
        "w-100 d-flex flex-wrap mt-6 pb-6",
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
                description={quest.description}
                allTasks={quest.tasks.length}
                completedTasks={
                  quest.tasks.filter((task) => task.status === "done").length
                }
                rewards={quest.tasks.map((task) => task.reward)}
                status={quest.status}
                onClick={() => (window.location.href = `/quests/${quest.id}`)}
              />
            </div>
          ))}
        </>
      ) : (
        <QuestShow questId={questId} />
      )}
    </div>
  );
};

export default Quests;

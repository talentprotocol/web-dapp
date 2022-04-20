import React, { useEffect, useState } from "react";
import TaskCard from "src/components/design_system/cards/TaskCard";
import { useWindowDimensionsHook } from "src/utils/window";
import { get } from "src/utils/requests";

import cx from "classnames";

const QuestShow = ({ questId }) => {
  const [tasks, setTasks] = useState(null);
  const { mobile } = useWindowDimensionsHook();

  useEffect(() => {
    get(`api/v1/quests/${questId}`).then((res) => {
      setTasks(res);
    });
  }, [questId]);

  return (
    <>
      {tasks && (
        <div
          className={cx(
            "w-100 d-flex flex-wrap",
            mobile ? "justify-content-center" : "justify-start"
          )}
        >
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cx("quest-card", "mt-4", !mobile && "pr-4")}
            >
              <TaskCard
                id={task.id}
                title={task.title}
                description={task.description}
                reward={task.reward}
                link={task.link}
                status={task.status}
                userId={task.userId}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default QuestShow;

import React from "react";
import TaskCard from "src/components/design_system/cards/TaskCard";
import { H3, P2 } from "src/components/design_system/typography";
import { Reward } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";
import { ApolloProvider, client } from "src/utils/thegraph";
import { Provider, railsContextStore } from "src/contexts/state";

import cx from "classnames";

const QuestShow = ({ quest }) => {
  const { mobile } = useWindowDimensionsHook();

  const rewards = quest.tasks.map((task) => task.reward);

  return (
    <>
      <div className="mb-6">
        <H3 className="mb-3" bold text={quest.title} />
        {rewards.map((reward) => (
          <div key={reward} className="pb-2 d-flex align-items-center">
            <Reward style={{ minWidth: "16px" }} pathClassName="star" />
            <P2 className="pl-2 text-primary-03" text={reward} />
          </div>
        ))}
      </div>
      {quest && (
        <div
          className={cx(
            "w-100 d-flex flex-wrap",
            mobile ? "justify-content-center" : "justify-start"
          )}
        >
          {quest.tasks.map((task) => (
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

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client(railsContext.contractsEnv)}>
      <Provider createStore={() => railsContextStore(railsContext)}>
        <QuestShow {...props} railsContext={railsContext} />
      </Provider>
    </ApolloProvider>
  );
};

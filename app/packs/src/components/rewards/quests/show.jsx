import React, { useEffect } from "react";

import { railsContextStore } from "src/contexts/state";

import TaskCard from "src/components/design_system/cards/TaskCard";
import Button from "src/components/design_system/button";
import { H3, P1 } from "src/components/design_system/typography";
import { ArrowLeft } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";
import { ApolloProvider, client } from "src/utils/thegraph";
import { questDescription } from "src/utils/questsHelpers";

import cx from "classnames";

const QuestShow = ({ quest, user, railsContext }) => {
  const setRailsContext = railsContextStore((state) => state.setRailsContext);
  const { mobile } = useWindowDimensionsHook();

  useEffect(() => {
    setRailsContext(railsContext);
  }, []);

  return (
    <>
      <div className="mb-6">
        <a className="button-link" href="/earn?tab=quests">
          <Button
            onClick={() => null}
            type="white-ghost"
            size="icon"
            className="d-flex align-items-center justify-content-center mb-4"
          >
            <ArrowLeft color="currentColor" size={16} />
          </Button>
        </a>
        <H3 className="mb-3" bold text={quest.title} />
        <P1 className="text-primary-03" text={questDescription(quest.type)} />
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
                type={task.type}
                reward={task.reward}
                link={task.link}
                status={task.status}
                userId={task.userId}
                user={user}
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
      <QuestShow {...props} railsContext={railsContext} />
    </ApolloProvider>
  );
};

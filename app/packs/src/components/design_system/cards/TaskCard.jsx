import React, { useMemo } from "react";
import { H5, Caption } from "src/components/design_system/typography";
import { Reward } from "src/components/icons";
import Button from "src/components/design_system/button";
import Web3ModalConnect from "src/components/login/Web3ModalConnect";
import { railsContextStore } from "src/contexts/state";
import { taskDescription, taskReward } from "src/utils/questsHelpers";

import cx from "classnames";

const TaskCard = ({ id, title, type, reward, link, status, userId }) => {
  const railsContext = railsContextStore((state) => state.railsContext);

  const buttonText = useMemo(() => {
    switch (status) {
      case "pending":
        return "Start Task";
      case "doing":
        return "Continue Task";
      case "claim_rewards":
        return "Claim Reward";
      case "done":
        return "Complete";
      default:
        return "Start Task";
    }
  }, [status]);

  const buttonType = useMemo(() => {
    switch (status) {
      case "pending":
        return "primary-outline";
      case "doing":
        return "primary-outline";
      case "claim_rewards":
        return "positive-default";
      case "done":
        return "positive-default";
      default:
        return "primary-default";
    }
  }, [status]);

  const completed = status === "done";
  const disabled = completed || !link;

  return (
    <div
      className={cx(
        "task-card",
        "p-4",
        "d-flex flex-column justify-content-between",
        completed && "disabled"
      )}
    >
      <div className="d-flex flex-column justify-content-between">
        <div className="d-flex flex-column justify-content-center">
          <H5
            className={cx(completed ? "text-primary-04" : "text-black")}
            bold
            text={title}
          />
          {taskDescription(type)}
          <Caption className="text-primary-04 pt-4 pb-2" bold text="Prize" />
          <div key={reward} className="pb-2 d-flex align-items-center">
            <Reward
              style={{ minWidth: "16px" }}
              className="mr-2"
              pathClassName={cx("reward-icon", completed && "disabled")}
            />
            {taskReward(type, completed)}
          </div>
        </div>
      </div>
      {title === "Connect wallet" && status !== "done" ? (
        <Web3ModalConnect
          user_id={userId}
          onConnect={() => window.location.reload()}
          railsContext={railsContext}
          buttonClassName={`w-100 extra-big-size-button ${buttonType}-button`}
        />
      ) : (
        <a href={disabled ? null : link}>
          <Button
            className="w-100"
            disabled={disabled}
            size="extra-big"
            type={buttonType}
            text={buttonText}
            onClick={() => null}
          />
        </a>
      )}
    </div>
  );
};

export default TaskCard;

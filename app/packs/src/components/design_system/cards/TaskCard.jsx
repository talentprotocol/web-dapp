import React, { useMemo, useState } from "react";
import { H5, Caption } from "src/components/design_system/typography";
import { Reward } from "src/components/icons";
import Button from "src/components/design_system/button";
import Web3ModalConnect from "src/components/login/Web3ModalConnect";
import { railsContextStore } from "src/contexts/state";
import { taskDescription, taskReward } from "src/utils/questsHelpers";
import ApplyToLaunchTokenModal from "src/components/design_system/modals/ApplyToLaunchTokenModal";

import cx from "classnames";

const TaskCard = ({ title, type, link, status, userId, user }) => {
  const railsContext = railsContextStore((state) => state.railsContext);

  const completed = status === "done";
  const disabled = completed || !link;
  const prize = taskReward(type, completed);

  const [showApplyToLaunchTokenModal, setShowApplyToLaunchTokenModal] =
    useState(false);

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

  const renderButton = () => {
    if (title === "Connect wallet" && status !== "done") {
      return (
        <Web3ModalConnect
          user_id={userId}
          onConnect={() => window.location.reload()}
          railsContext={railsContext}
          buttonClassName={`w-100 extra-big-size-button ${buttonType}-button`}
        />
      );
    } else if (title === "Apply to launch a token" && status !== "done") {
      return (
        <Button
          className="w-100"
          disabled={user.profile_type !== "supporter"}
          size="extra-big"
          type={buttonType}
          text={buttonText}
          onClick={() => setShowApplyToLaunchTokenModal(true)}
        />
      );
    } else {
      return (
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
      );
    }
  };

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
          {prize && (
            <>
              <Caption
                className="text-primary-04 pt-4 pb-2"
                bold
                text="Prize"
              />
              <div key={prize} className="pb-2 d-flex align-items-center">
                <Reward
                  style={{ minWidth: "16px" }}
                  className="mr-2"
                  pathClassName={cx("reward-icon", completed && "disabled")}
                />
                {prize}
              </div>
            </>
          )}
        </div>
      </div>
      {renderButton()}
      <ApplyToLaunchTokenModal
        show={showApplyToLaunchTokenModal}
        hide={() => setShowApplyToLaunchTokenModal(false)}
        investorId={user.investorId}
        username={user.username}
      />
    </div>
  );
};

export default TaskCard;

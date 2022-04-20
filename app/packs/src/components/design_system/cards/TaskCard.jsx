import React, { useMemo } from "react";
import { H5, P2, Caption } from "src/components/design_system/typography";
import { Reward } from "src/components/icons";
import Button from "src/components/design_system/button";
import Web3ModalConnect from "src/components/login/Web3ModalConnect";
import { useStore } from "src/contexts/state";

const TaskCard = ({ id, title, description, reward, link, status, userId }) => {
  const { railsContext } = useStore();

  const buttonText = useMemo(() => {
    switch (status) {
      case "pending":
        return "Start Challenge";
      case "doing":
        return "Continue Challenge";
      case "claim_rewards":
        return "Claim Reward";
      case "done":
        return "Complete";
      default:
        return "Start Challenge";
    }
  }, [status]);

  const buttonType = useMemo(() => {
    switch (status) {
      case "pending":
        return "primary-default";
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
    <div className="task-card p-4 d-flex flex-column justify-content-between">
      <div className="d-flex flex-column justify-content-between">
        <div className="d-flex flex-column justify-content-center">
          <H5 bold text={title} />
          <P2 className="pb-4" text={description} />
          <Caption className="text-primary-04 pb-2" bold text="Reward" />
          <div key={reward} className="pb-2 d-flex align-items-center">
            <Reward style={{ minWidth: "16px" }} pathClassName="star" />
            <P2 className="pl-2" text={reward} />
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

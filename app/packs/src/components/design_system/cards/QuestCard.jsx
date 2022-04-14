import React, { useMemo } from "react";
import { H5, P1, P2, Caption } from "src/components/design_system/typography";
import { Reward } from "src/components/icons";
import ProgressCircle from "src/components/design_system/progress_circle";
import Button from "src/components/design_system/button";
import Divider from "src/components/design_system/other/Divider";

const QuestCard = ({
  id,
  title,
  subtitle,
  description,
  allTasks,
  completedTasks,
  rewards,
  status,
  onClick,
}) => {
  const progress = completedTasks / allTasks || 0;
  const progressText = `${completedTasks} / ${allTasks}`;

  const buttonText = useMemo(() => {
    switch (status) {
      case "pending":
        return "Start Quest";
      case "doing":
        return "Continue Quest";
      case "claim_rewards":
        return "Claim Rewards";
      case "done":
        return "Complete";
      default:
        return "Start Quest";
    }
  }, [status]);

  const buttonType = useMemo(() => {
    switch (status) {
      case "pending":
        return "primary-default";
      case "doing":
        return "primary-outline";
      case "claim_rewards":
        return "positive-outline";
      case "done":
        return "positive-default";
      default:
        return "primary-default";
    }
  }, [status]);

  const completed = status === "done";

  return (
    <div className="highlights-card">
      <div className="p-4 quest-card-title d-flex justify-content-between">
        <div className="d-flex flex-column justify-content-center">
          <H5 bold text={title} />
          <P1 className="text-primary-03" text={subtitle} />
        </div>
        <div className="d-flex flex-column justify-content-center">
          <ProgressCircle
            id={id}
            width={58}
            progress={progress}
            text={progressText}
            done={status === "done"}
          />
        </div>
      </div>
      <Divider />
      <div className="p-4 pb-4 pt-6 d-flex flex-column justify-content-between quest-card-description">
        <div>
          <P2 className="pb-4" text={description} />
          <Caption className="text-primary-04 pb-2" bold text="Rewards" />
          {rewards.map((reward) => (
            <div key={reward} className="pb-2 d-flex align-items-center">
              <Reward style={{ minWidth: "16px" }} pathClassName="star" />
              <P2 className="text-black pl-2" text={reward} />
            </div>
          ))}
        </div>
        <Button
          className="w-100"
          disabled={completed}
          size="extra-big"
          type={buttonType}
          text={buttonText}
          onClick={() => onClick(id)}
        />
      </div>
    </div>
  );
};

export default QuestCard;

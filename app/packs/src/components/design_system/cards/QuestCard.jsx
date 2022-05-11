import React, { useMemo } from "react";
import { H5, P1, P2, Caption } from "src/components/design_system/typography";
import { Reward } from "src/components/icons";
import ProgressCircle from "src/components/design_system/progress_circle";
import Button from "src/components/design_system/button";
import Divider from "src/components/design_system/other/Divider";
import { TALENT_TOKEN_APPLICATION_FORM } from "src/utils/constants";
import {
  questDescription,
  taskReward,
  questRewards,
} from "src/utils/questsHelpers";

import cx from "classnames";

const QuestCard = ({
  id,
  title,
  subtitle,
  type,
  allTasks,
  completedTasks,
  tasksType,
  status,
  user,
}) => {
  const progress = completedTasks / allTasks || 0;
  const supporterOnTalentQuest = type === "Quests::Talent" && !user.is_talent;

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
        return "primary-outline";
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

  const taskRewards = tasksType.map((type) => taskReward(type, completed));
  const rewards = taskRewards.concat(questRewards(type, completed));

  const onClickButton = useMemo(() => {
    if (supporterOnTalentQuest) {
      return TALENT_TOKEN_APPLICATION_FORM;
    }

    return `/quests/${id}`;
  }, [supporterOnTalentQuest]);

  return (
    <div className={cx("highlights-card", completed && "disabled")}>
      <div className="p-4 quest-card-title d-flex justify-content-between">
        <div className="d-flex flex-column justify-content-center">
          <H5
            className={cx(completed ? "text-primary-04" : "text-black")}
            bold
            text={title}
          />
          <P1
            className={cx(completed ? "text-primary-04" : "text-primary-03")}
            text={subtitle}
          />
        </div>
        <div className="d-flex flex-column justify-content-center">
          <ProgressCircle
            id={id}
            width={58}
            progress={progress}
            completedTasks={completedTasks}
            allTasks={allTasks}
            done={status === "done"}
          />
        </div>
      </div>
      <Divider />
      <div className="p-4 pb-4 pt-6 d-flex flex-column justify-content-between quest-card-description">
        <div>
          <P2
            className={cx("pb-4", completed && "text-primary-04")}
            text={questDescription(type)}
          />
          <Caption className="text-primary-04 pb-2" bold text="Prizes" />
          {rewards.map(
            (reward) =>
              reward && (
                <div
                  key={reward.props.text}
                  className="pb-2 d-flex align-items-center"
                >
                  <Reward
                    style={{ minWidth: "16px" }}
                    pathClassName={cx("reward-icon", completed && "disabled")}
                    className="mr-2"
                  />
                  {reward}
                </div>
              )
          )}
        </div>
        <a
          className="button-link"
          href={onClickButton}
          target={supporterOnTalentQuest ? "_blank" : "_self"}
        >
          <Button
            className="w-100"
            disabled={completed}
            size="extra-big"
            type={buttonType}
            text={buttonText}
            onClick={() => null}
          />
        </a>
      </div>
    </div>
  );
};

export default QuestCard;

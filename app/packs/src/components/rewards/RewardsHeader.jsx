import React, { useEffect, useState } from "react";
import currency from "currency.js";

import { H3, H5, P1, P2 } from "src/components/design_system/typography";
import Tooltip from "src/components/design_system/tooltip";
import { Help } from "src/components/icons";

const sumRewardAmounts = (total, reward) => total + reward.amount;

const RewardsHeader = ({ rewards }) => {
  const [userRewards, setUserRewards] = useState({
    total: 0,
    referral_race: 0,
    talent_invites: 0,
    quests: 0,
    others: 0,
  });

  useEffect(() => {
    const total = rewards.reduce(sumRewardAmounts, 0);
    const talent_invites = rewards
      .filter((item) => item.category == "talent_invite")
      .reduce(sumRewardAmounts, 0);
    const quests = rewards
      .filter((item) => item.category == "quest")
      .reduce(sumRewardAmounts, 0);
    const others = rewards
      .filter((item) => item.category == "other" || item.category == "race")
      .reduce(sumRewardAmounts, 0);

    setUserRewards({
      total,
      talent_invites,
      quests,
      others,
    });
  }, [rewards]);

  const amountToTal = (amount) => `${currency(amount).dollars()} $TAL`;

  return (
    <div className="talent-rewards-header-row mb-6">
      <div className="d-flex flex-column col-lg-5 p-4 px-lg-0">
        <H3 bold>Invite friends. Earn rewards.</H3>
        <P1>Invite them to Talent Protocol and earn $TAL.</P1>
      </div>
      <div className="d-flex flex-column col-lg-5 talent-rewards-header-box px-4 px-lg-0">
        <div className="talent-rewards-highlight p-4">
          <P2 bold>Total Earnings</P2>
          <H5 bold>{amountToTal(userRewards.total)}</H5>
        </div>

        <div className="talent-rewards-header-item px-4 pt-4 pb-3">
          <P2>Quest Earnings</P2>
          <P2 className="text-black">{amountToTal(userRewards.quests)}</P2>
        </div>

        <div className="talent-rewards-header-item px-4 pb-3">
          <P2>Talent Invites Earnings</P2>
          <P2 className="text-black">
            {amountToTal(userRewards.talent_invites)}
          </P2>
        </div>
        <div className="talent-rewards-header-item px-4 pb-4">
          <Tooltip
            body="Referral Races, bounties, etc."
            popOverAccessibilityId={"others_rewards"}
            placement="top"
          >
            <div className="cursor-pointer d-flex align-items-center">
              <P2 className="mr-1">Others</P2>
              <Help color="currentColor" />
            </div>
          </Tooltip>
          <P2 className="text-black">{amountToTal(userRewards.others)}</P2>
        </div>
      </div>
    </div>
  );
};

export default RewardsHeader;

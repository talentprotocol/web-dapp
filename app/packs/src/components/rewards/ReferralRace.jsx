import React from "react";
import currency from "currency.js";

import { TALENT_TOKEN_APPLICATION_FORM } from "src/utils/constants";

import { P1, P2, P3, H4 } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";
import Caption from "src/components/design_system/typography/caption";
import Button from "src/components/design_system/button";
import Table from "src/components/design_system/table";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";

const sumRewardAmounts = (total, reward) => total + reward.amount;

const amountToTal = (amount) => `${currency(amount).dollars()} $TAL`;

const RaceHeader = ({ isEligible, isTalent, username }) => {
  const redirectToLaunchToken = () => {
    if (isTalent) {
      window.location.href = `u/${username}/edit_profile`;
    } else {
      window.open(TALENT_TOKEN_APPLICATION_FORM);
    }
  };

  if (!isEligible) {
    return (
      <div className="race-header-row p-4 p-lg-6 mx-4 mx-lg-0 overview-section">
        <div className="d-flex flex-column col-lg-6">
          <H4 className="mb-3 d-flex flex-row align-items-center" bold>
            Referral Race
            <Tag className="ml-2 tag-unavailable">
              <P3 bold className="tag-unavailable-label">
                Ended
              </P3>
            </Tag>
          </H4>
          <P1>
            From the 4th of April to the 15th of May we ran a different race
            every week in order to reward users that helped Talent Protocol
            grow, you can check the results below.
          </P1>
        </div>
        <div className="d-flex flex-column flex-lg-row justify-content-center justify-content-lg-end col-lg-5 px-4 px-lg-0 mt-4 mt-lg-0">
          <Button
            type="primary-default"
            size="big"
            onClick={() => (window.location.href = "/talent")}
          >
            Start Supporting
          </Button>
          <Button
            type="primary-outline"
            className="ml-0 ml-lg-2 mt-2 mt-lg-0"
            size="big"
            onClick={redirectToLaunchToken}
          >
            Launch a Talent Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="race-header-row">
      <div className="d-flex flex-column col-lg-5 px-4 px-lg-0">
        <H4 className="mb-4 d-flex flex-row align-items-center" bold>
          Referral Race
          <Tag className="ml-2 tag-unavailable">
            <P3 bold className="tag-unavailable-label">
              Ended
            </P3>
          </Tag>
        </H4>
        <P1>
          From the 4th of April to the 15th of May we ran a different race every
          week in order to reward users that helped Talent Protocol grow, you
          can check the results below.
        </P1>
      </div>
    </div>
  );
};

const Overview = ({
  raceRegisteredUsersCount,
  usersThatBoughtTokensCount,
  racesCount,
  racesTotalRewards,
}) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center px-4 px-lg-0 mt-6 mt-lg-7">
        <H4 bold className="mb-4" text="Overview"></H4>
      </div>
      <div className="d-flex flex-column flex-lg-row justify-content-lg-between">
        <div className="mx-4 mx-lg-0 mb-lg-0 mb-4 py-4 px-7 d-flex flex-column align-items-center justify-content-between overview-section rounded-sm">
          <P3 className="mb-2">Total races</P3>
          {racesCount}
        </div>
        <div className="mx-4 mx-lg-0 mb-lg-0 mb-4 py-4 px-7 d-flex flex-column align-items-center justify-content-between overview-section rounded-sm">
          <P3 className="mb-2">Users registered</P3>
          {raceRegisteredUsersCount}
        </div>
        <div className="mx-4 mx-lg-0 mb-lg-0 mb-4 py-4 px-7 d-flex flex-column align-items-center justify-content-between overview-section rounded-sm">
          <P3 className="mb-2">Users that bought Talent Tokens</P3>
          {usersThatBoughtTokensCount}
        </div>
        <div className="mx-4 mx-lg-0 py-4 px-7 d-flex flex-column align-items-center justify-content-between overview-section rounded-sm">
          <P3 className="mb-2">$TAL Distributed</P3>
          {racesTotalRewards}
        </div>
      </div>
    </>
  );
};

const WinnersTable = ({ raceRewards }) => {
  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center px-4 px-lg-0 mt-6 mt-lg-7">
        <H4 className="mx-4 mx-lg-0 mb-0" bold>
          Winners
        </H4>
      </div>
      <Table mode={"dark"} className="px-3 horizontal-scroll mb-2 mt-4">
        <Table.Head>
          <Table.Th className="w-100 pl-4 pl-lg-3">
            <Caption bold text={"User"} />
          </Table.Th>
          <Table.Th className="text-black">
            <Caption bold text={"REWARDS"} />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {raceRewards.map((reward) => (
            <Table.Tr key={`reward-${reward.id}`}>
              <td
                className="w-100 pl-4 pl-lg-3 py-3"
                onClick={() =>
                  (window.location.href = `/u/${reward.user.username}`)
                }
              >
                <div className="d-flex align-items-center">
                  <TalentProfilePicture
                    src={reward.user.profilePictureUrl}
                    height="32"
                  />
                  <P2 text={reward.user.username} bold className="ml-3" />
                </div>
              </td>
              <Table.Td
                className={"race-table-rewards-cell py-3"}
                onClick={() =>
                  (window.location.href = `/u/${reward.user.usernamee}`)
                }
              >
                <P2 className="text-black" text={amountToTal(reward.amount)} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const ReferralRace = ({
  racesCount,
  raceRewards,
  username,
  isEligible,
  isTalent,
  raceRegisteredUsersCount,
  usersThatBoughtTokensCount,
}) => {
  const racesTotalRewards = () => {
    const amount = raceRewards.reduce(sumRewardAmounts, 0);

    return amountToTal(amount);
  };

  return (
    <div className="mt-6 mt-lg-7 d-flex flex-column">
      <RaceHeader
        isEligible={!!isEligible}
        isTalent={isTalent}
        username={username}
      />
      <Overview
        raceRegisteredUsersCount={raceRegisteredUsersCount}
        usersThatBoughtTokensCount={usersThatBoughtTokensCount}
        racesCount={racesCount}
        racesTotalRewards={racesTotalRewards()}
      />
      <WinnersTable raceRewards={raceRewards} />
    </div>
  );
};

export default ReferralRace;

import React, { useState, useEffect } from "react";
import currency from "currency.js";
import { ethers } from "ethers";
import cx from "classnames";

import {
  P1,
  P2,
  P3,
  H3,
  H4,
  H5,
} from "src/components/design_system/typography";
import { Copy } from "src/components/icons";
import Button from "src/components/design_system/button";
import Tooltip from "src/components/design_system/tooltip";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import Tag from "src/components/design_system/tag";

const InviteHeader = () => {
  return (
    <div className="race-header-row">
      <div className="d-flex flex-column col-lg-5 px-4 px-lg-0">
        <H4 className="mb-3" bold>
          Talent invite
        </H4>
        <P1>
          This is a special type of invite that allows you to refer a talented
          friend to launch a token immediately. They skip the traditional
          application process and receive $200, while you earn 250 $TAL per
          talent invited (250 TAL for the first 5, 100 TAL after that).
        </P1>
      </div>
    </div>
  );
};

const Overview = ({ talentInvites, rewards }) => {
  const [invite, setInvite] = useState({
    code: "N/A",
    uses: 0,
    usesLeft: 0,
  });

  useEffect(() => {
    if (talentInvites.length == 0) {
      return;
    }

    const uses = talentInvites.reduce((sum, invite) => sum + invite.uses, 0);

    const unlimitedCodeInvite = talentInvites.filter(
      (inv) => inv.max_uses === null
    );
    if (unlimitedCodeInvite.length > 0) {
      setInvite({
        code: unlimitedCodeInvite[0].code,
        uses,
        usesLeft: "Unlimited",
      });

      return;
    }

    const max_uses = talentInvites.reduce(
      (sum, invite) => sum + invite.max_uses,
      0
    );

    setInvite({
      code: talentInvites[0].code,
      uses,
      usesLeft: max_uses - uses,
    });
  }, [talentInvites]);

  const getInviteLink = (full) => {
    if (invite.code == "N/A") {
      return invite.code;
    }

    if (full) {
      return `https://beta.talentprotocol.com/sign_up?code=${invite.code}`;
    } else {
      return `https://beta.tal...?code=${invite.code}`;
    }
  };

  const copyCode = () => navigator.clipboard.writeText(invite.code);

  const copyLink = () => navigator.clipboard.writeText(getInviteLink(true));

  const amountToTal = (amount) => `${currency(amount).dollars()} $TAL`;

  return (
    <div className="d-flex flex-column flex-lg-row justify-content-lg-between mt-6 mt-lg-7">
      <div className="lg-w-49 mx-4 mx-lg-0 px-0 d-flex flex-column overview-section rounded-sm mb-6 mb-lg-7">
        <P1 bold className="m-4 text-black">
          Talent Invite Link
        </P1>
        <div className="d-flex flex-column mx-4 flex-lg-row justify-content-lg-between align-items-lg-center">
          <P3 className="mb-0">Referral Code</P3>
          <div className="d-flex flex-row align-items-center justify-content-between justify-content-lg-end">
            <P2 className="text-black">{invite.code}</P2>
            <Tooltip
              body={"Copied!"}
              popOverAccessibilityId={"copy_code_success"}
              placement="top"
            >
              <Button
                type="white-ghost"
                className="ml-2 text-primary"
                onClick={copyCode}
              >
                <Copy color="currentColor" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="d-flex flex-column mx-4 mb-4 flex-lg-row justify-content-lg-between align-items-lg-center mt-2">
          <P3 className="mb-0">Referral Link</P3>
          <div className="d-flex flex-row align-items-center justify-content-between justify-content-lg-end">
            <P2 className="text-black">{getInviteLink(false)}</P2>
            <Tooltip
              body={"Copied!"}
              popOverAccessibilityId={"copy_link_success"}
              placement="top"
            >
              <Button
                type="white-ghost"
                className="ml-2 text-primary"
                onClick={copyLink}
              >
                <Copy color="currentColor" />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="lg-w-49 mx-4 mx-lg-0 px-0 d-flex flex-column justify-content-between overview-section rounded-sm pb-4  mb-6 mb-lg-7">
        <P1 bold className="m-4 text-black">
          Overview
        </P1>
        <div className="d-flex flex-column flex-lg-row mx-4 justify-content-between">
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <P3>Total Earnigs</P3>
            <H5 bold>{amountToTal(rewards)}</H5>
          </div>
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <P3>Talent Invites Used</P3>
            <H5 bold>{invite.uses}</H5>
          </div>
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <P3>Talent Invites Available</P3>
            <H5 bold>{invite.usesLeft}</H5>
          </div>
        </div>
      </div>
    </div>
  );
};

const TalentTable = ({ talentList }) => {
  const totalSupplyToString = (totalSupply) => {
    const bignumber = ethers.BigNumber.from(totalSupply).div(10);
    return ethers.utils.commify(ethers.utils.formatUnits(bignumber));
  };

  if (talentList.length == 0) {
    return;
  }

  return (
    <>
      <H4 bold className="px-4 px-lg-0 mt-7">
        My Referrals
      </H4>
      <Table mode={"dark"} className="px-4 mb-5 mt-4">
        <Table.Head>
          <Table.Th className="pl-4 pl-lg-0">
            <Caption bold text={"TALENT"} />
          </Table.Th>
          <Table.Th className="hide-content-in-mobile">
            <Caption bold text={"OCCUPATION"} />
          </Table.Th>
          <Table.Th className="pr-3 pr-lg-0">
            <Caption bold text={"SUPPORTERS"} />
          </Table.Th>
          <Table.Th className="col-3 hide-content-in-mobile">
            <Caption bold text={"MARKET CAP"} />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {talentList.map((talent) => (
            <Table.Tr key={`talent-${talent.id}`}>
              <Table.Td
                className="pl-3 pl-lg-0 py-3"
                onClick={() =>
                  (window.location.href = `/u/${talent.user.username}`)
                }
              >
                <div className="d-flex align-items-center">
                  <TalentProfilePicture
                    src={talent.profile_picture_url}
                    height="32"
                  />
                  <P2 text={talent.username} bold className="ml-3" />
                  {talent.token.contract_id ? (
                    <P2
                      text={`$${talent.token.ticker}`}
                      bold
                      className="text-primary-03 ml-2"
                    />
                  ) : (
                    <Tag className="coming-soon-tag ml-2">
                      <P3 className="current-color" bold text="Coming Soon" />
                    </Tag>
                  )}
                </div>
              </Table.Td>
              <Table.Td
                className="py-3 hide-content-in-mobile"
                onClick={() => (window.location.href = `/u/${talent.username}`)}
              >
                <P2 text={talent.occupation} />
              </Table.Td>
              <Table.Td
                className="pr-3 pr-lg-0"
                onClick={() => (window.location.href = `/u/${talent.username}`)}
              >
                <P2
                  text={
                    talent.token.contract_id
                      ? `${talent.supporters_count || 0}`
                      : "-"
                  }
                />
              </Table.Td>
              <Table.Td
                className={cx(
                  "py-3 hide-content-in-mobile",
                  talent.token.contract_id
                    ? ""
                    : "d-flex justify-content-center"
                )}
                onClick={() => (window.location.href = `/u/${talent.username}`)}
              >
                <P2
                  text={
                    talent.token.contract_id
                      ? `$${totalSupplyToString(talent.total_supply)}`
                      : "-"
                  }
                />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const TalentInvites = ({ invites, rewards, talentList }) => {
  const [userRewards, setUserRewards] = useState({
    talent_invites: 0,
  });

  useEffect(() => {
    const talent_invites = rewards
      .filter((item) => item.category == "TALENT_INVITE")
      .reduce((sum, item) => sum + item.amount, 0);

    setUserRewards({
      talent_invites,
    });
  }, [rewards]);

  return (
    <div className="mt-6 mt-lg-7 d-flex flex-column">
      <InviteHeader isEligible={true} />
      <Overview talentInvites={invites} rewards={userRewards.talent_invites} />
      <TalentTable talentList={talentList} />
    </div>
  );
};

export default TalentInvites;

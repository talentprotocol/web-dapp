import React, { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import cx from "classnames";
import dayjs from "dayjs";

import {
  compareStrings,
  compareNumbers,
  compareDates,
} from "src/utils/compareHelpers";
import {
  P1,
  P2,
  P3,
  H3,
  H4,
  H5,
} from "src/components/design_system/typography";
import { Copy, Help } from "src/components/icons";
import Button from "src/components/design_system/button";
import Tooltip from "src/components/design_system/tooltip";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import Tag from "src/components/design_system/tag";
import { TALENT_TOKEN_APPLICATION_FORM } from "src/utils/constants";

const InviteHeader = ({ isTalent, username }) => {
  const redirectToLaunchToken = () => {
    if (isTalent) {
      window.location.href = `u/${username}/edit_profile`;
    } else {
      window.open(TALENT_TOKEN_APPLICATION_FORM);
    }
  };

  return (
    <div className="race-header-row p-4 p-lg-6 mb-7 mx-4 mx-lg-0 overview-section">
      <div className="d-flex flex-column col-lg-6">
        <H4 className="mb-3 d-flex flex-row align-items-center" bold>
          Talent Invite
        </H4>
        <P1>
          This is a special type of invite that allows you to refer a talented
          friend to launch a token immediately. They skip the traditional
          application process and receive $200, while you earn 250 $TAL per
          talent invited (250 TAL for the first 5, 100 TAL after that). To
          unlock Talent Invites you must have launched a talent token.
        </P1>
      </div>
      <div className="d-flex flex-column flex-lg-row justify-content-center justify-content-lg-end col-lg-5 px-4 px-lg-0 mt-4 mt-lg-0">
        <Button
          type="primary-default"
          size="big"
          onClick={redirectToLaunchToken}
        >
          Launch a Talent Token
        </Button>
      </div>
    </div>
  );
};

const Overview = ({ inviteType, invites }) => {
  const [invite, setInvite] = useState({
    code: "N/A",
    uses: 0,
    usesLeft: 0,
  });

  useEffect(() => {
    if (invites.length == 0) {
      return;
    }

    const uses = invites.reduce((sum, invite) => sum + invite.uses, 0);

    const unlimitedCodeInvite = invites.filter((inv) => inv.max_uses === null);
    if (unlimitedCodeInvite.length > 0) {
      setInvite({
        code: unlimitedCodeInvite[0].code,
        uses,
        usesLeft: "Unlimited",
      });

      return;
    }

    const max_uses = invites.reduce((sum, invite) => sum + invite.max_uses, 0);

    setInvite({
      code: invites[0].code,
      uses,
      usesLeft: max_uses - uses,
    });
  }, [invites]);

  const getInviteLink = (full) => {
    if (invite.code == "N/A") {
      return invite.code;
    }

    if (full) {
      return `https://beta.talentprotocol.com/sign_up?code=${invite.code}`;
    } else {
      const start = invite.code.length > 5 ? invite.code.length - 5 : 0;
      return `https://beta.talentprotocol...${invite.code.substring(
        start,
        invite.code.length
      )}`;
    }
  };

  const copyCode = () => navigator.clipboard.writeText(invite.code);

  const copyLink = () => navigator.clipboard.writeText(getInviteLink(true));

  return (
    <div className="d-flex flex-column mt-5">
      <div className="mx-4 mx-lg-0 py-6 d-flex flex-column flex-lg-row justify-content-between overview-section rounded-sm">
        <div className="d-flex flex-column mx-4 mb-4 mb-lg-0">
          <div className="d-flex flex-column">
            <P3 className="mb-2">{`${inviteType} Invites Used`}</P3>
            <H5 bold>{invite.uses}</H5>
          </div>
        </div>
        <div className="d-flex flex-column mx-4 mb-4 mb-lg-0">
          <div className="d-flex flex-column">
            {inviteType == "Talent" ? (
              <Tooltip
                body={
                  "You have 1 invite available. As soon as your friend signs up and launches their token, you'll get a new invite to send and a new opportunity to earn 250 $TAL."
                }
                popOverAccessibilityId={"talent_invites_available"}
                placement="top"
              >
                <div className="mb-2 cursor-pointer d-flex align-items-center">
                  <P3 className="mr-2">{`${inviteType} Invites Available`}</P3>
                  <Help color="currentColor" />
                </div>
              </Tooltip>
            ) : (
              <P3 className="mb-2">{`${inviteType} Invites Available`}</P3>
            )}

            <H5 bold>{invite.usesLeft}</H5>
          </div>
        </div>
        <div className="d-flex flex-column mx-4 mb-4 mb-lg-0">
          <P3 className="mb-2">Referral Code</P3>
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
        <div className="d-flex flex-column mx-4 mb-4 mb-lg-0">
          <P3 className="mb-2">Referral Link</P3>
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
    </div>
  );
};

const TalentTable = ({ talentList }) => {
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const totalSupplyToString = (totalSupply) => {
    const bignumber = ethers.BigNumber.from(totalSupply).div(10);
    return ethers.utils.commify(ethers.utils.formatUnits(bignumber));
  };

  if (!talentList || talentList.length == 0) {
    return null;
  }

  const toggleDirection = () => {
    if (sortDirection == "asc") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  };

  const onOptionClick = (option) => {
    if (option == selectedSort) {
      toggleDirection();
    } else {
      setSortDirection("asc");
      setSelectedSort(option);
    }
  };

  const compareSupporters = (talent1, talent2) =>
    compareStrings(talent1.username, talent2.username);

  const compareName = (talent1, talent2) =>
    compareStrings(talent1.user?.name, talent2.user?.name);

  const compareOccupation = (talent1, talent2) =>
    compareStrings(talent1.occupation, talent2.occupation);

  const compareMarketCap = (talent1, talent2) =>
    compareNumbers(talent1.totalSupply, talent2.totalSupply);

  const compareCreatedAt = (talent1, talent2) =>
    compareDates(talent1.created_at, talent2.created_at);

  const sortIcon = (option) => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  const filteredTalents = useMemo(() => {
    let desiredTalent = [...talentList];
    let comparisonFunction;

    switch (selectedSort) {
      case "Supporters":
        comparisonFunction = compareSupporters;
        break;
      case "Occupation":
        comparisonFunction = compareOccupation;
        break;
      case "Market Cap":
        comparisonFunction = compareMarketCap;
        break;
      case "Created At":
        comparisonFunction = compareCreatedAt;
        break;
      case "Alphabetical Order":
        comparisonFunction = compareName;
        break;
    }

    if (sortDirection === "asc") {
      return desiredTalent.sort(comparisonFunction).reverse();
    } else if (sortDirection === "desc") {
      return desiredTalent.sort(comparisonFunction);
    }
    return desiredTalent;
  }, [talentList, selectedSort, sortDirection]);

  return (
    <>
      <H4 bold className="px-4 px-lg-0 mt-7">
        Talent Referrals
      </H4>
      <Table mode={"dark"} className="px-4 mb-5 mt-4">
        <Table.Head>
          <Table.Th className="pl-4 pl-lg-0">
            <Caption
              bold
              onClick={() => onOptionClick("Alphabetical Order")}
              text={`TALENT${sortIcon("Alphabetical Order")}`}
              className="mr-lg-2 cursor-pointer"
            />
          </Table.Th>
          <Table.Th className="hide-content-in-mobile">
            <Caption
              bold
              onClick={() => onOptionClick("Created At")}
              text={`JOINED AT${sortIcon("Created At")}`}
              className="mr-lg-2 cursor-pointer"
            />
          </Table.Th>
          <Table.Th className="hide-content-in-mobile">
            <Caption
              bold
              onClick={() => onOptionClick("Occupation")}
              text={`OCCUPATION${sortIcon("Occupation")}`}
              className="mr-lg-2 cursor-pointer"
            />
          </Table.Th>
          <Table.Th className="pr-3 pr-lg-0">
            <Caption
              bold
              text={`SUPPORTERS${sortIcon("Supporters")}`}
              onClick={() => onOptionClick("Supporters")}
              className="mr-lg-2 cursor-pointer"
            />
          </Table.Th>
          <Table.Th className="col-3 px-0 hide-content-in-mobile">
            <Caption
              bold
              text={`MARKET CAP${sortIcon("Market Cap")}`}
              className="cursor-pointer"
              onClick={() => onOptionClick("Market Cap")}
            />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {filteredTalents.map((talent) => (
            <Table.Tr key={`talent-${talent.id}`}>
              <Table.Td
                className="pl-3 pl-lg-0 py-3"
                onClick={() => (window.location.href = `/u/${talent.username}`)}
              >
                <div className="d-flex align-items-center">
                  <TalentProfilePicture
                    src={talent.profile_picture_url}
                    height="32"
                    className="ml-2"
                  />
                  <P2 text={talent.username} bold className="ml-3" />
                  {talent.token.contract_id ? (
                    <P2
                      text={`$${talent.token.ticker}`}
                      bold
                      className="text-primary-03 ml-2 mr-lg-2"
                    />
                  ) : (
                    <Tag className="coming-soon-tag ml-2 mr-lg-2">
                      <P3 className="current-color" bold text="Coming Soon" />
                    </Tag>
                  )}
                </div>
              </Table.Td>
              <Table.Td
                className="py-3 hide-content-in-mobile"
                onClick={() => (window.location.href = `/u/${talent.username}`)}
              >
                <P2
                  className="mr-lg-2"
                  text={dayjs(talent.created_at).format("MMMM D, YYYY")}
                />
              </Table.Td>
              <Table.Td
                className="py-3 hide-content-in-mobile"
                onClick={() => (window.location.href = `/u/${talent.username}`)}
              >
                <P2 className="mr-lg-2" text={talent.occupation || "-"} />
              </Table.Td>
              <Table.Td
                className="pr-3 pr-lg-0"
                onClick={() => (window.location.href = `/u/${talent.username}`)}
              >
                <P2
                  className="mr-lg-2"
                  text={
                    talent.token.contract_id
                      ? `${talent.supporters_count || 0}`
                      : "-"
                  }
                />
              </Table.Td>
              <Table.Td
                className={cx("py-3 hide-content-in-mobile")}
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
      <P3 className="text-center">You’ve reached the end of the list</P3>
    </>
  );
};

const Invites = ({
  talentInvites,
  supporterInvites,
  talentList,
  isTalent,
  username,
}) => {
  const talentInvitesEligible = () =>
    !!talentInvites && talentInvites.length > 0;

  return (
    <div className="mt-6 mt-lg-7 d-flex flex-column">
      {!talentInvitesEligible() && (
        <InviteHeader isTalent={isTalent} username={username} />
      )}
      <Tooltip
        body={
          "Invite a friend to join Talent Protocol and support high-potential talent."
        }
        popOverAccessibilityId={"talent_invites"}
        placement="left"
      >
        <div className="mx-4 mx-lg-0 cursor-pointer d-flex align-items-center">
          <H3 bold className="mr-2" text="Supporter Invite"></H3>
          <Help color="currentColor" />
        </div>
      </Tooltip>
      <Overview inviteType="Supporter" invites={supporterInvites} />
      {talentInvitesEligible() && (
        <>
          <Tooltip
            body={
              "Invite a friend to launch a token. They'll skip the application process and become able to launch their talent token. After launching it, they'll receive $200 and you'll earn 250 $TAL for the first 5 who do it. After that, you'll get 100$TAL for each friend that you invite and that launches a token."
            }
            popOverAccessibilityId={"talent_invites"}
            placement="left"
          >
            <div className="mx-4 mx-lg-0 mt-7 cursor-pointer d-flex align-items-center">
              <H3 bold className="mr-2" text="Talent Invite"></H3>
              <Help color="currentColor" />
            </div>
          </Tooltip>
          <Overview inviteType="Talent" invites={talentInvites} />
          <TalentTable talentList={talentList} />
        </>
      )}
    </div>
  );
};

export default Invites;

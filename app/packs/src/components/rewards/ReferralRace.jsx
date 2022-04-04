import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

import { Copy, OrderBy } from "src/components/icons";

import {
  P1,
  P2,
  P3,
  H3,
  H4,
  H5,
} from "src/components/design_system/typography";
import Caption from "src/components/design_system/typography/caption";
import Button from "src/components/design_system/button";
import Tooltip from "src/components/design_system/tooltip";
import Table from "src/components/design_system/table";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";

const RaceHeader = ({ isEligible }) => {
  if (!isEligible) {
    return (
      <div className="race-header-row p-6 bg-light">
        <div className="d-flex flex-column col-lg-7 px-4 px-lg-0">
          <H4 className="mb-3" bold>
            Referral Race
          </H4>
          <P1>
            Every week the 3 users with the most referrals will win a total of
            2,000 $TAL. The 1st wins 1200, the 2nd 500 and the 3rd 300. No
            repeat winners. You need to be an active user to unlock invites and
            enter the race. To become an active user you need to buy or launch a
            talent token.
          </P1>
        </div>
        <div className="d-flex flex-row justify-content-end col-lg-5 px-4 px-lg-0">
          <Button
            type="primary-default"
            size="big"
            onClick={() => console.log("1")}
          >
            Start Supporting
          </Button>
          <Button
            type="primary-outline"
            className="ml-2"
            size="big"
            onClick={() => console.log("2")}
          >
            Launch a Talent Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="race-header-row">
        <div className="d-flex flex-column col-lg-5 px-4 px-lg-0">
          <H4 className="mb-3" bold>
            Referral Race
          </H4>
          <P1>
            Every week the 3 users with the most referrals will win a total of
            2,000 $TAL. The 1st wins 1200, the 2nd 500 and the 3rd 300. No
            repeat winners.
          </P1>
        </div>
        <div className="d-flex flex-row justify-content-between col-lg-5 px-4 px-lg-0 mt-5 mt-lg-0">
          <div className="race-time-counter-box">
            <P2>Days</P2>
            <H3 bold>3</H3>
          </div>
          <div className="race-time-counter-box">
            <P2>Hours</P2>
            <H3 bold>6</H3>
          </div>
          <div className="race-time-counter-box">
            <P2>Minutes</P2>
            <H3 bold>31</H3>
          </div>
          <div className="race-time-counter-box">
            <P2>Seconds</P2>
            <H3 bold>20</H3>
          </div>
        </div>
      </div>

      <Caption
        className="align-self-end mr-4 mr-lg-0 mt-2"
        text="TIME LEFT UNTIL THIS RACE ENDS"
      />
    </>
  );
};

const Overview = ({ copyCode, copyLink }) => {
  return (
    <div className="d-flex flex-column flex-lg-row justify-content-lg-between mt-6 mt-lg-7">
      <div className="lg-w-49 mx-4 mx-lg-0 px-0 d-flex flex-column bg-light rounded-sm mb-6 mb-lg-0">
        <P1 bold className="m-4 text-black">
          Supporter Invite Link
        </P1>
        <div className="d-flex flex-column mx-4 flex-lg-row justify-content-lg-between align-items-lg-center">
          <P3 className="mb-2 mb-lg-0">Referral Code</P3>
          <div className="d-flex flex-row align-items-center justify-content-between justify-content-lg-end">
            <P2 className="text-black">TAL-janecooper</P2>
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
          <P3 className="mb-2 mb-lg-0">Referral Link</P3>
          <div className="d-flex flex-row align-items-center justify-content-between justify-content-lg-end">
            <P2 className="text-black">
              https://beta.talent.../TAL-janecooper
            </P2>
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
      <div className="lg-w-49 mx-4 mx-lg-0 px-0 d-flex flex-column justify-content-between bg-light rounded-sm pb-4  mb-6 mb-lg-0">
        <P1 bold className="m-4 text-black">
          Race Overview
        </P1>
        <div className="d-flex flex-row mx-4 justify-content-between">
          <div className="d-flex flex-column">
            <P3>Your Position</P3>
            <H5 bold>41</H5>
          </div>
          <div className="d-flex flex-column">
            <P3>Invites Used</P3>
            <H5 bold>4</H5>
          </div>
          <div className="d-flex flex-column">
            <P3>Invites available</P3>
            <H5 bold>Unlimited</H5>
          </div>
        </div>
      </div>
    </div>
  );
};

const RaceDropdown = ({ race, setRace }) => {
  const options = ["Current Race", "Race #2", "Race #1"];

  const selectedClass = (option) =>
    option == race ? " text-primary" : "text-black";

  return (
    <Dropdown>
      <Dropdown.Toggle
        className="talent-button white-subtle-button normal-size-button no-caret d-flex justify-content-between align-items-center"
        id="referral-race-dropdown"
        bsPrefix=""
        as="div"
        style={{ height: 34, width: 150 }}
      >
        <P2 bold text={race} className="mr-2 align-middle text-black" />
        <OrderBy black />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option) => (
          <Dropdown.Item
            key={`tab-dropdown-${option}`}
            className="d-flex flex-row justify-content-between"
            onClick={() => setRace(option)}
          >
            <P3 bold text={option} className={selectedClass(option)} />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const RaceTable = () => {
  const [selectedRace, setSelectedRace] = useState("Current Race");
  const [topInviters, setTopInviters] = useState([
    { id: 1, position: 1, name: "ABC", username: "ABC", invites: 15 },
    { id: 2, position: 2, name: "DEF", username: "ABC", invites: 10 },
    { id: 3, position: 3, name: "GHI", username: "ABC", invites: 5 },
    { id: 4, position: 4, name: "JKL", username: "ABC", invites: 4 },
    { id: 5, position: 5, name: "MNO", username: "ABC", invites: 3 },
    { id: 6, position: 40, name: "PQR", username: "ABC", invites: 1 },
  ]);

  const getRewardsForPosition = (position) => {
    if (position === 1) {
      return "1,200 $TAL";
    } else if (position === 2) {
      return "500 $TAL";
    } else if (position === 3) {
      return "300 $TAL";
    } else {
      return "0 $TAL";
    }
  };

  const getPositionCircle = (position) => {
    if (position <= 3) {
      return (
        <div
          style={{ width: 24, height: 24 }}
          className="bg-primary rounded-circle mr-4 text-center permanent-text-white"
        >
          <P2 bold>{position}</P2>
        </div>
      );
    } else if (position <= 5) {
      return (
        <div
          style={{ width: 24, height: 24 }}
          className="bg-surface-hover text-primary-03 rounded-circle mr-4 text-center"
        >
          <P2 bold>{position}</P2>
        </div>
      );
    } else {
      return (
        <div
          style={{ width: 24, height: 24 }}
          className="text-primary-03 text-center mr-4"
        >
          <P2>{position}</P2>
        </div>
      );
    }
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center px-4 px-lg-0">
        <H4 bold>Ranking</H4>
        <RaceDropdown race={selectedRace} setRace={setSelectedRace} />
      </div>
      <Table mode={"dark"} className="px-3 horizontal-scroll mb-5">
        <Table.Head>
          <Table.Th className="w-100 pl-4 pl-lg-3">
            <Caption bold text={"POSITION"} />
          </Table.Th>
          <Table.Th className="pr-4 pr-lg-0">
            <Caption bold text={"INVITES"} />
          </Table.Th>
          <Table.Th className="hide-content-in-mobile">
            <Caption bold text={"REWARDS"} />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {topInviters.map((inviter) => (
            <Table.Tr key={`inviter-${inviter.id}`}>
              <td
                className="w-100 pl-4 pl-lg-3"
                onClick={() =>
                  (window.location.href = `/u/${inviter.username}`)
                }
              >
                <div className="d-flex align-items-center">
                  {getPositionCircle(inviter.position)}
                  <TalentProfilePicture
                    src={inviter.profilePictureUrl}
                    height="32"
                  />
                  <P2 text={inviter.name} bold className="ml-2" />
                </div>
              </td>
              <Table.Td
                className="race-table-invites-cell"
                onClick={() =>
                  (window.location.href = `/u/${inviter.username}`)
                }
              >
                <P2 text={inviter.invites} />
              </Table.Td>
              <Table.Td
                className={`race-table-rewards-cell hide-content-in-mobile ${
                  inviter.position < 3 ? "text-black" : "text-primary-03"
                }`}
                onClick={() =>
                  (window.location.href = `/u/${talent.user.username}`)
                }
              >
                <P2 text={getRewardsForPosition(inviter.position)} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const ReferralRace = (props) => {
  const copyCode = () => navigator.clipboard.writeText("TAL-janecooper");

  const copyLink = () =>
    navigator.clipboard.writeText("https://beta/TAL-janecooper");

  return (
    <div className="mt-6 mt-lg-7 d-flex flex-column">
      <RaceHeader isEligible={true} />
      <Overview copyCode={copyCode} copyLink={copyLink} />
      <RaceTable />
    </div>
  );
};

export default ReferralRace;

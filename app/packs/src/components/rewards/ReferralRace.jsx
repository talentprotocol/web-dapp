import React from "react";

import {
  P1,
  P2,
  P3,
  H3,
  H4,
  H5,
} from "src/components/design_system/typography";
import Caption from "src/components/design_system/typography/caption";
import { Copy } from "src/components/icons";
import Button from "src/components/design_system/button";
import Tooltip from "src/components/design_system/tooltip";

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

const ReferralRace = (props) => {
  const copyCode = () => navigator.clipboard.writeText("TAL-janecooper");

  const copyLink = () =>
    navigator.clipboard.writeText("https://beta/TAL-janecooper");

  return (
    <div className="mt-6 mt-lg-7 d-flex flex-column">
      <RaceHeader isEligible={true} />
      <Overview copyCode={copyCode} copyLink={copyLink} />
      <div></div>
    </div>
  );
};

export default ReferralRace;

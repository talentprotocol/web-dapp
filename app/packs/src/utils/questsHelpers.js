import React from "react";
import { P2 } from "src/components/design_system/typography";
import Link from "src/components/design_system/link";
import {
  COMMUNITY_S01_NFT_AIRDROP,
  TOP_UP_YOUR_ACCOUNT,
  BUY_TALENT_TOKENS,
  PROMOTE_YOUR_TOKENS,
} from "src/utils/constants";

import cx from "classnames";

export const questDescription = (type) => {
  switch (type) {
    case "Quests::User":
      return "Complete your 'About' section and connect your wallet";
    case "Quests::Supporter":
      return "Add 3 talent to your Watchlist and buy at least 1 Talent Token";
    case "Quests::Talent":
      return "Complete your profile and share it with your network";
    case "Quests::Scout":
      return "Share your personal invite code and get at least 5 talented friends to join Talent Protocol";
    default:
      return "";
  }
};

export const taskDescription = (type) => {
  switch (type) {
    case "Tasks::FillInAbout":
      return (
        <P2
          className="text-primary-03"
          text="Go to 'Edit Profile' and add information to the 'About' section."
        />
      );
    case "Tasks::ConnectWallet":
      return (
        <P2
          className="text-primary-03"
          text="Connect your wallent in the top menu."
        />
      );
    case "Tasks::Watchlist":
      return (
        <P2
          className="text-primary-03"
          text="Use the watchlist feature (the little star in each talent profile) to save your favourite people for later."
        />
      );
    case "Tasks::BuyTalentToken":
      return (
        <div className="d-flex flex-wrap">
          <Link
            text="Top up your account"
            href={TOP_UP_YOUR_ACCOUNT}
            target="_blank"
          />
          <P2 className="text-primary-03 px-2" text="and" />
          <Link
            text="buy at least 1 Talent Token."
            href={BUY_TALENT_TOKENS}
            target="_blank"
          />
        </div>
      );
    case "Tasks::PublicProfile":
      return (
        <P2
          className="text-primary-03"
          text="Complete your profile until it reaches 100% and set it to public, so everyone can see it."
        />
      );
    case "Tasks::ShareProfile":
      return (
        <div className="d-flex flex-wrap">
          <P2
            className="text-primary-03"
            text="Get 10 people to visit your profile. Use this to"
          />
          <Link
            text="Promote your token on Social Media"
            href={PROMOTE_YOUR_TOKENS}
            target="_blank"
          />
        </div>
      );
    case "Tasks::LaunchToken":
      return (
        <P2
          className="text-primary-03"
          text="Launch your token so people can start investing in you"
        />
      );
    case "Tasks::Register":
      return (
        <P2
          className="text-primary-03"
          text="Use your personal invite code so people can register"
        />
      );
    default:
      return "";
  }
};

export const taskReward = (type, disabled) => {
  switch (type) {
    case "Tasks::FillInAbout":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="0.01 CELO"
        />
      );
    case "Tasks::ConnectWallet":
      return (
        <Link
          text="User NFT"
          href={COMMUNITY_S01_NFT_AIRDROP}
          target="_blank"
        />
      );
    case "Tasks::Watchlist":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="Unlimited supporter invites"
        />
      );
    case "Tasks::BuyTalentToken":
      return (
        <Link
          text="Member NFT"
          href={COMMUNITY_S01_NFT_AIRDROP}
          target="_blank"
        />
      );
    case "Tasks::PublicProfile":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="Unlimited supporter invites"
        />
      );
    case "Tasks::ShareProfile":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="1 Talent Invite (and get extra invites once every time your friends launch a token)"
        />
      );
    case "Tasks::LaunchToken":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="2,000 Talent Tokens (worth $200)"
        />
      );
    case "Tasks::Register":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="100 TAL"
        />
      );
    default:
      return "";
  }
};

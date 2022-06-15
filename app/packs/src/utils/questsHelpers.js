import React from "react";
import { P2 } from "src/components/design_system/typography";
import ParagraphLink from "src/components/design_system/link/ParagraphLink";
import {
  COMMUNITY_S01_NFT_AIRDROP,
  TOP_UP_YOUR_ACCOUNT,
  BUY_TALENT_TOKENS,
} from "src/utils/constants";

import cx from "classnames";

export const questDescription = (type) => {
  switch (type) {
    case "Quests::User":
      return "Complete your 'About' section and connect your wallet";
    case "Quests::Supporter":
      return "Add 3 talent to your Watchlist and buy at least 1 Talent Token";
    case "Quests::TalentProfile":
      return "Complete the mandatory fields of your profile and share it with your network.";
    case "Quests::TalentToken":
      return "Complete the mandatory fields of your profile and apply to be verified.";
    case "Quests::Ambassador":
      return "Share your personal invite code and get 5 talented friends to join Talent Protocol";
    case "Quests::Scout":
      return "Share your personal Talent invite code with talented friends, and be rewarded when they launch a token.";
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
        <P2 className="text-primary-03">
          <ParagraphLink
            text="Top up your account"
            href={TOP_UP_YOUR_ACCOUNT}
            target="_blank"
          />{" "}
          and{" "}
          <ParagraphLink
            text="buy at least 1 Talent Token."
            href={BUY_TALENT_TOKENS}
            target="_blank"
          />
        </P2>
      );
    case "Tasks::PublicProfile":
      return (
        <P2
          className="text-primary-03"
          text="Complete your profile until it reaches 100% and set it to public, so everyone can see it."
        />
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
          text="Use your personal talent invite code to invite new users."
        />
      );
    case "Tasks::Highlights":
      return (
        <P2
          className="text-primary-03"
          text="Add highlights to your profile."
        />
      );
    case "Tasks::Goals":
      return (
        <P2 className="text-primary-03" text="Add goals to your profile." />
      );
    case "Tasks::ApplyTokenLaunch":
      return (
        <P2
          className="text-primary-03"
          text="Apply to launch your Talent Token"
        />
      );
    case "Tasks::Perks":
      return (
        <P2 className="text-primary-03" text="Add perks to your profile." />
      );
    case "Tasks::InviteTokenLaunch":
      return (
        <P2
          className="text-primary-03"
          text="Your talented friends launch their token."
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
          text="0.001 CELO"
        />
      );
    case "Tasks::ConnectWallet":
      return (
        <ParagraphLink
          text="User NFT"
          href={COMMUNITY_S01_NFT_AIRDROP}
          target="_blank"
          disabled={disabled}
        />
      );
    case "Tasks::BuyTalentToken":
      return (
        <ParagraphLink
          text="Member NFT"
          href={COMMUNITY_S01_NFT_AIRDROP}
          target="_blank"
          disabled={disabled}
        />
      );
    case "Tasks::PublicProfile":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="Unlimited user invites"
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
          text="1500 TAL"
        />
      );
    case "Tasks::InviteTokenLaunch":
      return (
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="250 TAL"
        />
      );
    default:
      return "";
  }
};

export const questRewards = (type, disabled) => {
  switch (type) {
    case "Quests::User":
      return [
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="Referral Race"
        />,
      ];
    case "Quests::TalentProfile":
      return [
        <ParagraphLink
          text="Member NFT"
          href={COMMUNITY_S01_NFT_AIRDROP}
          target="_blank"
          disabled={disabled}
        />,
      ];
    case "Quests::TalentToken":
      return [
        <P2
          className={cx(disabled ? "text-primary-04" : "text-black")}
          text="1 Talent Invite (and get extra invites once every time your friends launch a token)"
        />,
      ];
    default:
      return null;
  }
};

import React, { useState } from "react";
import { H3, Caption } from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import ApplyToLaunchTokenModal from "src/components/design_system/modals/ApplyToLaunchTokenModal";
import { TALENT_PROTOCOL_DISCORD } from "src/utils/constants";

const TalentTokenApplicationBanner = ({ user }) => {
  const [showApplyToLaunchTokenModal, setShowApplyToLaunchTokenModal] =
    useState(false);

  return (
    <>
      <div className="talent-background launch-token-banner-background">
        <div className="talent-background-text permanent-text-white">
          <div className="col-1"></div>
          <div style={{ width: "450px" }}>
            <Caption
              className="mb-2 text-yellow"
              text="TALENT TOKEN APPLICATION"
              bold
            />
            <H3
              className="pb-4"
              text="Launch your own token and create your on-chain resume."
              bold
            />
            <Button
              type="primary-default"
              size="extra-big"
              onClick={() => setShowApplyToLaunchTokenModal(true)}
              text="Apply Now"
            />
          </div>
        </div>
      </div>
      <ApplyToLaunchTokenModal
        show={showApplyToLaunchTokenModal}
        hide={() => setShowApplyToLaunchTokenModal(false)}
        investorId={user.investorId}
        username={user.username}
      />
    </>
  );
};

const ConnectWalletBanner = ({ beginnerQuestId }) => (
  <div className="talent-background connect-wallet-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption
          className="mb-2 text-yellow"
          text="WELCOME TO TALENT PROTOCOL"
          bold
        />
        <H3
          className="pb-4"
          text="Connect a wallet to unlock your first community NFT."
          bold
        />
        <a className="button-link" href={`/quests/${beginnerQuestId}`}>
          <Button
            type="primary-default"
            size="extra-big"
            onClick={() => null}
            text="Connect Wallet"
          />
        </a>
      </div>
    </div>
  </div>
);

const BrowseTalentBanner = ({ supporterQuestId }) => (
  <div className="talent-background browse-talent-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption
          className="mb-2 text-primary"
          text="SUCCESS IS COLLECTIVE"
          bold
        />
        <H3
          className="pb-4 permanent-text-black"
          text="Start supporting high-potential talent today."
          bold
        />
        <a className="button-link" href={`/quests/${supporterQuestId}`}>
          <Button
            type="primary-default"
            size="extra-big"
            onClick={() => null}
            text="Browse Talent"
          />
        </a>
      </div>
    </div>
  </div>
);

const JoinCommunityBanner = () => (
  <div className="talent-background join-community-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption
          className="mb-2 text-primary"
          text="A COMMUNITY OF TALENT"
          bold
        />
        <H3
          className="pb-4 permanent-text-black"
          text="Join our Discord server and access exclusive community channels."
          bold
        />
        <a
          className="button-link"
          href={TALENT_PROTOCOL_DISCORD}
          target="_blank"
        >
          <Button
            type="primary-default"
            size="extra-big"
            onClick={() => null}
            text="Join Community"
          />
        </a>
      </div>
    </div>
  </div>
);

const LaunchMyTokenBanner = ({ username }) => (
  <div className="talent-background launch-my-token-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption className="mb-2 text-yellow" text="LET'S DO THIS!" bold />
        <H3
          className="pb-4"
          text="Launch a Talent Token and win $200 in tokens."
          bold
        />
        <a
          className="button-link"
          href={`/u/${username}/edit_profile?tab=Token`}
        >
          <Button
            type="primary-default"
            size="extra-big"
            onClick={() => null}
            text="Launch my token"
          />
        </a>
      </div>
    </div>
  </div>
);

const InviteTalentBanner = () => (
  <div className="talent-background invite-talent-banner-background">
    <div className="talent-background-text permanent-text-white">
      <div className="col-1"></div>
      <div style={{ width: "450px" }}>
        <Caption className="mb-2 text-primary" text="SCOUT-TO-EARN" bold />
        <H3
          className="pb-4 permanent-text-black"
          text="Invite your high-potential friends to join Talent Protocol and earn TAL."
          bold
        />
        <a className="button-link" href="/earn?tab=talent">
          <Button
            type="primary-default"
            size="extra-big"
            onClick={() => null}
            text="Invite Talent"
          />
        </a>
      </div>
    </div>
  </div>
);

const DiscoveryBanners = ({ user }) => {
  const currentBanner = () => {
    if (!user.walletId) {
      return <ConnectWalletBanner beginnerQuestId={user.beginnerQuestId} />;
    } else if (user.profileType === "approved") {
      return <LaunchMyTokenBanner username={user.username} />;
    } else if (user.profileType == "talent" && user.tokenLaunched) {
      return <InviteTalentBanner />;
    } else if (user.activeSupporter) {
      return <JoinCommunityBanner />;
    } else if (user.walletId) {
      return <TalentTokenApplicationBanner user={user} />;
    }
  };
  return <>{currentBanner()}</>;
};

export default DiscoveryBanners;

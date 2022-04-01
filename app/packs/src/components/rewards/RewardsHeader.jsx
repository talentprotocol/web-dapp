import React from "react";

import { H3, H5, P1, P2, P3 } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";

const RewardsHeader = ({ rewards }) => {
  // @TODO calculate values based on rewards categories

  return (
    <div className="talent-rewards-header-row mb-3 mb-lg-5">
      <div className="d-flex flex-column col-lg-5 p-4 px-lg-0">
        <H3 bold>Invite friends. Earn rewards.</H3>
        <P1>Invite them to Talent Protocol and earn $TAL.</P1>
      </div>
      <div className="d-flex flex-column col-lg-5 talent-rewards-header-box px-4 px-lg-0">
        <div className="talent-rewards-highlight p-4">
          <P2 bold>Total Earnings</P2>
          <H5 bold>2,500 $TAL</H5>
        </div>
        <div className="talent-rewards-header-item px-4 pt-4 pb-3">
          <P2>Referral Race Earnings</P2>
          <P2 className="text-black">500 $TAL</P2>
        </div>
        <div className="talent-rewards-header-item px-4 pb-3">
          <P2>Talent Invites Earnings</P2>
          <P2 className="text-black">1,250 $TAL</P2>
        </div>
        <div className="talent-rewards-header-item px-4 pb-3">
          <P2>Others</P2>
          <P2 className="text-black">350 $TAL</P2>
        </div>
        <div className="talent-rewards-header-item justify-content-start px-4 pb-4">
          <P2 className="text-primary-04">Quest Earnings</P2>
          <Tag className="ml-2">
            <P3 className="text-primary-04" bold text="Coming Soon" />
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default RewardsHeader;

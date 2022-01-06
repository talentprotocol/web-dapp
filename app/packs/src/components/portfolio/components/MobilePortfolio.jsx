import React from "react";

import Supporting from "./components/Supporting";

import currency from "currency.js";

import P3 from "src/components/design_system/typography/p3";
import P2 from "src/components/design_system/typography/p2";
import H4 from "src/components/design_system/typography/h4";
import Button from "src/components/design_system/button";

const MobilePortfolio = ({
  activeTab,
  setActiveTab,
  mode,
  overallCUSD,
  overallTAL,
  totalRewardsInCUSD,
  rewardsClaimed,
  cUSDBalance,
  cUSDBalanceInTAL,
  supportedTalents,
  returnValues,
  onClaim,
  tokenAddress,
  chainAPI,
}) => {
  return (
    <div className={`d-flex flex-column`}>
      <div className="d-flex flex-row justify-content-between flex-wrap w-100 portfolio-amounts-overview mt-4 p-4">
        <div className="d-flex flex-column mt-3">
          <P3 mode={mode} text={"Total Balance"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(overallCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(overallTAL).format().substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column mt-3">
          <P3 mode={mode} text={"Total Rewards Claimed"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(totalRewardsInCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(parseFloat(rewardsClaimed()))
                .format()
                .substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column mt-3">
          <P3 mode={mode} text={"Wallet Balance"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(cUSDBalance).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(cUSDBalanceInTAL).format().substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-row align-items-end">
          <div className="d-flex flex-row">
            <Button
              onClick={() => console.log("Get Funds")}
              type="primary-default"
              mode={mode}
              className="mr-2 mt-2"
            >
              Get Funds
            </Button>
            <Button
              onClick={() => console.log("Withdraw")}
              disabled={true}
              type="white-subtle"
              mode={mode}
              className="mr-2 mt-2"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
      <div className="w-100 talent-table-tabs mt-3 d-flex flex-row align-items-center">
        <div
          onClick={() => setActiveTab("Overview")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Overview" ? " active-talent-table-tab" : ""
          }`}
        >
          Overview
        </div>
        <div
          onClick={() => setActiveTab("Supporting")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Supporting" ? " active-talent-table-tab" : ""
          }`}
        >
          Supporting
        </div>
        {tokenAddress && (
          <div
            onClick={() => setActiveTab("Supporters")}
            className={`py-2 px-2 talent-table-tab${
              activeTab == "Supporters" ? " active-talent-table-tab" : ""
            }`}
          >
            Supporters
          </div>
        )}
      </div>
      {activeTab == "Supporting" && (
        <Supporting
          mode={mode}
          talents={supportedTalents}
          returnValues={returnValues}
          onClaim={onClaim}
        />
      )}
      {activeTab == "Supporters" && (
        <Supporters
          mode={mode}
          tokenAddress={tokenAddress}
          onClaim={onClaim}
          chainAPI={chainAPI}
        />
      )}
    </div>
  );
};

export default MobilePortfolio;

import React from "react";

import Supporting from "./Supporting";

import currency from "currency.js";

import P3 from "src/components/design_system/typography/p3";
import P2 from "src/components/design_system/typography/p2";
import H4 from "src/components/design_system/typography/h4";
import P1 from "src/components/design_system/typography/p1";
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
  talentTokensInTAL,
  talentTokensInCUSD,
  supportedTalents,
  returnValues,
  onClaim,
  tokenAddress,
  chainAPI,
}) => {
  return (
    <div className={`d-flex flex-column`}>
      <div className="w-100 talent-table-tabs horizontal-scroll mt-3 d-flex flex-row align-items-center">
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
      {activeTab == "Overview" && (
        <div className="d-flex flex-row justify-content-between flex-wrap w-100py-3">
          <div className="d-flex flex-column mt-3 px-4 ">
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
          <div className="d-flex flex-row w-100 align-items-end  px-4 ">
            <div className="d-flex flex-row w-100">
              <Button
                onClick={() => console.log("Withdraw")}
                disabled={true}
                type="white-subtle"
                mode={mode}
                className="mr-2 mt-2 w-100"
              >
                Withdraw
              </Button>
              <Button
                onClick={() => console.log("Get Funds")}
                type="primary-default"
                mode={mode}
                className="mt-2 w-100"
              >
                Get Funds
              </Button>
            </div>
          </div>
          <div className={`divider ${mode} my-3`}></div>
          <div className="d-flex flex-column pt-3 px-4">
            <P1 mode={mode} text={"Portfolio"} bold className="w-100" />
            <div className="d-flex flex-row w-100 justify-content-between align-items-center">
              <P2 mode={mode} text="Wallet Balance" className="mr-2" />
              <div className="d-flex flex-column justify-content-center align-items-end">
                <P2
                  mode={mode}
                  text={currency(cUSDBalance).format()}
                  bold
                  className="text-right"
                />
                <P2
                  mode={mode}
                  text={`${currency(cUSDBalanceInTAL)
                    .format()
                    .substring(1)} $TAL`}
                  className="text-right"
                />
              </div>
            </div>
            <div className="d-flex flex-row w-100 justify-content-between align-items-center mt-3">
              <P2 mode={mode} text="Talent Tokens Balance" className="mr-2" />
              <div className="d-flex flex-column justify-content-center align-items-end">
                <P2
                  mode={mode}
                  text={currency(talentTokensInCUSD).format()}
                  bold
                  className="text-right"
                />
                <P2
                  mode={mode}
                  text={`${currency(talentTokensInTAL)
                    .format()
                    .substring(1)} $TAL`}
                  className="text-right"
                />
              </div>
            </div>
            <div className="d-flex flex-row w-100 justify-content-between align-items-center my-3">
              <P2 mode={mode} text="Talent Tokens Balance" className="mr-2" />
              <div className="d-flex flex-column justify-content-center align-items-end">
                <P2
                  mode={mode}
                  text={currency(totalRewardsInCUSD).format()}
                  bold
                  className="text-right"
                />
                <P2
                  mode={mode}
                  text={`${currency(parseFloat(rewardsClaimed()))
                    .format()
                    .substring(1)} $TAL`}
                  className="text-right"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab == "Supporting" && (
        <Supporting
          mode={mode}
          talents={supportedTalents}
          returnValues={returnValues}
          onClaim={onClaim}
          talentTokensInCUSD={talentTokensInCUSD}
          talentTokensInTAL={talentTokensInTAL}
          mobile={true}
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

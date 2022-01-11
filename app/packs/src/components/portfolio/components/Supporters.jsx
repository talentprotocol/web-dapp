import React, { useState, useMemo, useEffect } from "react";

import { ethers } from "ethers";
import currency from "currency.js";

import { parseAndCommify } from "src/onchain/utils";
import { useQuery, GET_TALENT_PORTFOLIO_FOR_ID } from "src/utils/thegraph";
import { get } from "src/utils/requests";

import P2 from "src/components/design_system/typography/p2";
import P3 from "src/components/design_system/typography/p3";
import H4 from "src/components/design_system/typography/h4";
import H5 from "src/components/design_system/typography/h5";
import Button from "src/components/design_system/button";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import { Spinner } from "src/components/icons";

const SupporterOverview = ({ loading, talentRewards, marketCap, mode }) => {
  const marketCapCUSD = loading ? 0.0 : Number.parseFloat(marketCap) * 0.02;
  const pendingRewardsCUSD = loading
    ? 0.0
    : Number.parseFloat(talentRewards) * 0.02;

  return (
    <div className="d-flex flex-row justify-content-between flex-wrap w-100 mt-4">
      <div className="d-flex flex-column mt-3 portfolio-amounts-overview p-3 w-32">
        <P3 mode={mode} text={"Market Cap"} />
        <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
          <H4
            mode={mode}
            text={currency(marketCapCUSD).format()}
            bold
            className="mb-0 mr-2"
          />
          <P2
            mode={mode}
            text={`${ethers.utils.commify(
              Number.parseFloat(marketCap).toFixed(2)
            )} $TAL`}
            bold
          />
        </div>
      </div>
      <div className="d-flex flex-column mt-3 portfolio-amounts-overview p-3 w-32">
        <P3 mode={mode} text={"Total Rewards Claimed"} />
        <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
          <H4 mode={mode} text={"$0.00"} bold className="mb-0 mr-2" />
          <P2 mode={mode} text={"0 $TAL"} bold />
        </div>
      </div>
      <div className="d-flex flex-column mt-3 portfolio-amounts-overview p-3 w-32">
        <P3 mode={mode} text={"Unclaimed Rewards"} className="text-warning" />
        <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
          <H4
            mode={mode}
            text={currency(pendingRewardsCUSD).format()}
            bold
            className="mb-0 mr-2"
          />
          <P2
            mode={mode}
            text={`${ethers.utils.commify(
              Number.parseFloat(talentRewards).toFixed(2)
            )} $TAL`}
            bold
          />
        </div>
      </div>
    </div>
  );
};

const Supporters = ({ mode, tokenAddress, chainAPI }) => {
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO_FOR_ID, {
    variables: { id: tokenAddress?.toLowerCase() },
  });

  const [supporterInfo, setSupporterInfo] = useState({});
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(false);
  const [returnValues, setReturnValues] = useState({});

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
    setShowDropdown(false);
  };

  const loadReturns = async (accountId) => {
    if (chainAPI && accountId) {
      const value = await chainAPI.calculateEstimatedReturns(
        tokenAddress,
        accountId
      );

      return ethers.utils.formatUnits(value.talentRewards);
    }

    return "0";
  };

  const supporters = useMemo(() => {
    if (!data || data.talentToken == null) {
      return [];
    }

    return data.talentToken.supporters.map(({ amount, supporter }) => ({
      id: supporter.id,
      amount: ethers.utils.formatUnits(amount),
    }));
  }, [data]);

  useEffect(() => {
    supporters.forEach((supporter) => {
      get(`/api/v1/users/${supporter.id.toLowerCase()}`).then((response) => {
        setSupporterInfo((prev) => ({
          ...prev,
          [supporter.id]: {
            profilePictureUrl: response.profilePictureUrl,
            username: response.username,
            id: response.id,
          },
        }));
      });
    });
  }, [supporters]);

  const updateAll = async () => {
    supporters.forEach((element) => {
      loadReturns(element.id).then((returns) => {
        setReturnValues((prev) => ({
          ...prev,
          [element.id]: returns,
        }));
      });
    });
  };

  useEffect(() => {
    updateAll();
  }, [supporters, chainAPI]);

  const talentData = useMemo(() => {
    if (!data || data.talentToken == null) {
      return {
        totalValueLocked: 0,
        supporterCounter: 0,
        totalSupply: 0,
        marketCap: 0,
        rewardsReady: 0,
      };
    }

    return {
      totalValueLocked: ethers.utils.formatUnits(
        data.talentToken.totalValueLocked
      ),
      supporterCounter: data.talentToken.supporterCounter,
      totalSupply: ethers.utils.formatUnits(data.talentToken.totalSupply),
      marketCap: ethers.utils.formatUnits(data.talentToken.marketCap),
      rewardsReady: ethers.utils.formatUnits(data.talentToken.rewardsReady),
    };
  }, [data]);

  const compareName = (talent1, talent2) => {
    if (talent1.name > talent2.name) {
      return 1;
    } else if (talent1.name < talent2.name) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareAmount = (user1, user2) => {
    if (parseFloat(user1.amount) < parseFloat(user2.amount)) {
      return 1;
    } else if (parseFloat(user1.amount) > parseFloat(user2.amount)) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareRewards = (user1, user2) => {
    const talent1Amount = parseFloat(loadReturns(user1.id).replaceAll(",", ""));
    const talent2Amount = parseFloat(loadReturns(user2.id).replaceAll(",", ""));

    if (talent1Amount < talent2Amount) {
      return 1;
    } else if (talent1Amount > talent2Amount) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortedSupporters = () => {
    let desiredSupporters = supporters;
    if (sortDirection == "asc") {
      let comparisonFunction;

      switch (selectedSort) {
        case "Amount":
          comparisonFunction = compareAmount;
          break;
        case "Rewards":
          comparisonFunction = compareRewards;
          break;
        case "Alphabetical Order":
          comparisonFunction = compareName;
          break;
      }

      desiredSupporters.sort(comparisonFunction);
    } else {
      desiredSupporters.reverse();
    }

    return desiredSupporters;
  };

  const talToUSD = (amount) => {
    return parseFloat(amount) * 0.02;
  };

  const sortIcon = (option) => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <Spinner />
      </div>
    );
  }

  if (!loading && sortedSupporters().length == 0) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <H5 mode={mode} text="You don't have any Supporter" bold />
        <P2 mode={mode} text="All your supporters will be listed here" bold />
      </div>
    );
  }

  return (
    <>
      <SupporterOverview
        supporterCount={supporters.length}
        loading={loading}
        reserve={talentData.totalValueLocked}
        talentRewards={talentData.rewardsReady}
        marketCap={talentData.marketCap}
        mode={mode}
      />
      <Table mode={mode} className="px-3 horizontal-scroll mt-4">
        <Table.Head>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Alphabetical Order")}
              bold
              text={`SUPPORTER${sortIcon("Alphabetical Order")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Amount")}
              bold
              text={`AMOUNT${sortIcon("Amount")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Rewards")}
              bold
              text={`REWARDS${sortIcon("Rewards")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption bold text="Action" />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {sortedSupporters().map((supporter) => (
            <Table.Tr
              key={`supporter-${supporter.id}`}
              className="reset-cursor"
            >
              <Table.Td>
                <div className="d-flex flex-row">
                  <TalentProfilePicture
                    src={supporterInfo[supporter.id]?.profilePictureUrl}
                    height="24"
                  />
                  <P2
                    text={`${supporterInfo[supporter.id]?.username}`}
                    bold
                    className="ml-2"
                  />
                  <P2
                    text={`(${supporter.id.substring(0, 10)}...)`}
                    className="ml-2"
                  />
                </div>
              </Table.Td>
              <Table.Td>
                <P2 text={parseAndCommify(supporter.amount)} />
              </Table.Td>
              <Table.Td className="pr-3">
                <P2 text={parseAndCommify(returnValues[supporter.id] || "0")} />
              </Table.Td>
              <Table.Td className="pr-3">
                <Button
                  onClick={() =>
                    (window.location.href = `/messages?user=${
                      supporterInfo[supporter.id]?.id
                    }`)
                  }
                  disabled={!supporterInfo[supporter.id]?.id}
                  type="primary-ghost"
                  mode={mode}
                  className="mr-2 remove-background underline-hover"
                >
                  Message
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default Supporters;

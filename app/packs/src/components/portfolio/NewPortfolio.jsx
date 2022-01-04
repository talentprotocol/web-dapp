import React, {
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { ethers } from "ethers";
import { OnChain } from "src/onchain";
import currency from "currency.js";
import { parseAndCommify } from "src/onchain/utils";

import {
  ApolloProvider,
  useQuery,
  GET_SUPPORTER_PORTFOLIO,
  client,
} from "src/utils/thegraph";

import { get } from "src/utils/requests";
import { useWindowDimensionsHook } from "src/utils/window";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import P3 from "src/components/design_system/typography/p3";
import P2 from "src/components/design_system/typography/p2";
import H4 from "src/components/design_system/typography/h4";
import Button from "src/components/design_system/button";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import { parse } from "url";

const Supporting = ({
  mode,
  talentTokensInCUSD,
  talentTokensInTAL,
  totalRewardsInCUSD,
  rewardsClaimed,
  talents,
  returnValues,
  onClaim,
}) => {
  const [talentProfilePictures, setTalentProfilePictures] = useState({});
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const [sortDirection, setSortDirection] = useState("asc");

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

  useEffect(() => {
    talents.forEach((talent) => {
      get(`api/v1/talent/${talent.contract_id.toLowerCase()}`).then(
        (response) => {
          setTalentProfilePictures((prev) => ({
            ...prev,
            [talent.contract_id]: response.profilePictureUrl,
          }));
        }
      );
    });
  }, [talents]);

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

  const returns = (contract_id) => {
    if (returnValues[contract_id]) {
      return parseAndCommify(talToUSD(returnValues[contract_id].toString()));
    }

    return "0.0";
  };

  return (
    <>
      {/* <div className="d-flex flex-row justify-content-between flex-wrap w-100 mt-4">
        <div className="d-flex flex-column portfolio-amounts-overview mr-3 p-3">
          <P3 mode={mode} text={"Total Talent Tokens"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(talentTokensInCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(talentTokensInTAL).format().substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column portfolio-amounts-overview mr-3 p-3">
          <P3 mode={mode} text={"Rewards Claimed"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(totalRewardsInCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(parseFloat(rewardsClaimed))
                .format()
                .substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column portfolio-amounts-overview p-3">
          <P3
            mode={mode}
            text={"Unclaimed Rewards"}
            className="text-warning portfolio-unclaimed-rewards"
          />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(allUnclaimedRewards()).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(allUnclaimedRewards() * 5)
                .format()
                .substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
      </div> */}
      <Table mode={mode} className="px-3 horizontal-scroll mt-4">
        <Table.Head>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Alphabetical Order")}
              bold
              text={`TALENT${sortIcon("Alphabetical Order")}`}
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
              onClick={() => onOptionClick("TAL")}
              bold
              text={`TAL LOCKED${sortIcon("TAL")}`}
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
          {talents.map((talent) => (
            <Table.Tr
              key={`talent-${talent.contract_id}`}
              onClick={() => (window.location.href = `/talent/${talent.name}`)}
            >
              <Table.Td>
                <div className="d-flex">
                  <TalentProfilePicture
                    src={talentProfilePictures[talent.contract_id]}
                    height="24"
                  />
                  <P2 text={`${talent.name}`} bold className="ml-2" />
                  <P2 text={`${talent.symbol}`} className="ml-2" />
                </div>
              </Table.Td>
              <Table.Td>
                <P2 text={parseAndCommify(talent.amount)} />
              </Table.Td>
              <Table.Td>
                <P2 text={parseAndCommify(talent.amount * 5)} />
              </Table.Td>
              <Table.Td className="pr-3">
                <P2 text={returns(talent.contract_id)} />
              </Table.Td>
              <Table.Td className="pr-3">
                <Button
                  onClick={() => onClaim(talent.contract_id)}
                  disabled={true}
                  type="primary-ghost"
                  mode={mode}
                  className="mr-2"
                >
                  Claim rewards
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

const NewPortfolioTable = (props) => {
  return <></>;
};

const NewPortfolio = ({ address, railsContext }) => {
  // --- On chain variables ---
  const [localAccount, setLocalAccount] = useState(address || "");
  const { loading, error, data, refetch } = useQuery(GET_SUPPORTER_PORTFOLIO, {
    variables: { id: localAccount.toLowerCase() },
  });
  const [chainAPI, setChainAPI] = useState(null);
  const [stableBalance, setStableBalance] = useState(0);
  const [returnValues, setReturnValues] = useState({});
  const [activeContract, setActiveContract] = useState(null);
  const [show, setShow] = useState(false);
  const [loadingRewards, setLoadingRewards] = useState(false);

  // --- Interface variables ---
  const { height, width } = useWindowDimensionsHook();
  const mobile = width < 992;
  const theme = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState(
    mobile ? "Overview" : "Supporting"
  );

  // --- On chain functions ---

  const supportedTalents = useMemo(() => {
    if (!data || data.supporter == null) {
      return [];
    }

    return data.supporter.talents.map(({ amount, talAmount, talent }) => ({
      id: talent.owner,
      symbol: talent.symbol,
      name: talent.name,
      amount: ethers.utils.formatUnits(amount),
      talAmount: ethers.utils.formatUnits(talAmount),
      totalSupply: ethers.utils.formatUnits(talent.totalSupply),
      nrOfSupporters: talent.supporterCounter,
      contract_id: talent.id,
    }));
  }, [data]);

  const rewardsClaimed = () => {
    if (!data || data.supporter == null) {
      return 0;
    }

    return ethers.utils.formatUnits(data.supporter.rewardsClaimed);
  };

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);

    await newOnChain.connectedAccount();
    await newOnChain.loadStaking();
    await newOnChain.loadStableToken();
    const balance = await newOnChain.getStableBalance(true);

    if (balance) {
      setStableBalance(balance);
    }

    if (localAccount != "" && newOnChain.account) {
      setLocalAccount(newOnChain.account);
      refetch();
    }

    if (newOnChain) {
      setChainAPI(newOnChain);
    }
  });

  const updateAll = async () => {
    supportedTalents.forEach((element) => {
      loadReturns(element.contract_id).then((returns) => {
        setReturnValues((prev) => ({
          ...prev,
          [element.contract_id]: returns,
        }));
      });
    });
  };

  const talentTokensSum = useMemo(() => {
    let sum = ethers.BigNumber.from(0);

    supportedTalents.map((talent) => {
      sum = sum.add(ethers.utils.parseUnits(talent.amount));
    });
    return ethers.utils.formatUnits(sum);
  }, [supportedTalents]);

  useEffect(() => {
    updateAll();
  }, [supportedTalents, chainAPI]);

  useEffect(() => {
    setupChain();
  }, []);

  const loadReturns = async (contractAddress) => {
    if (chainAPI && contractAddress) {
      const value = await chainAPI.calculateEstimatedReturns(
        contractAddress,
        null
      );

      if (value?.stakerRewards) {
        return ethers.utils.formatUnits(value.stakerRewards);
      } else {
        return "0";
      }
    }

    return "0";
  };

  const claimRewards = async () => {
    if (chainAPI && activeContract) {
      if (!(await chainAPI.recognizedChain())) {
        await chainAPI.switchChain();
      } else {
        setLoadingRewards(true);
        await chainAPI.claimRewards(activeContract).catch(() => null);
        refetch();
      }
    }
    setLoadingRewards(false);
    setShow(false);
    setActiveContract(null);
  };

  const onClaim = (contract_id) => {
    setActiveContract(contract_id);
    setShow(true);
  };

  // --- Overview calculations ---
  const cUSDBalance = parseFloat(stableBalance);
  const talentTokensTotal = parseFloat(talentTokensSum);
  const cUSDBalanceInTAL = cUSDBalance * 50;
  const totalRewardsInCUSD = parseFloat(rewardsClaimed()) * 0.02;
  const talentTokensInTAL = talentTokensTotal * 5;
  const talentTokensInCUSD = talentTokensTotal * 0.1;

  const overallCUSD = cUSDBalance + talentTokensInCUSD;
  const overallTAL = cUSDBalanceInTAL + talentTokensInTAL;

  return (
    <div className={`d-flex flex-column ${mobile ? "" : "px-3"}`}>
      <div className="d-flex flex-row justify-content-between flex-wrap w-100 portfolio-amounts-overview mt-4 p-4">
        <div className="d-flex flex-column">
          <P3 mode={theme.mode()} text={"Total Balance"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={theme.mode()}
              text={currency(overallCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={theme.mode()}
              text={`${currency(overallTAL).format().substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column">
          <P3 mode={theme.mode()} text={"Total Rewards Claimed"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={theme.mode()}
              text={currency(totalRewardsInCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={theme.mode()}
              text={`${currency(parseFloat(rewardsClaimed()))
                .format()
                .substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column">
          <P3 mode={theme.mode()} text={"Wallet Balance"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={theme.mode()}
              text={currency(cUSDBalance).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={theme.mode()}
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
              mode={theme.mode()}
              className="mr-2"
            >
              Get Funds
            </Button>
            <Button
              onClick={() => console.log("Withdraw")}
              disabled={true}
              type="white-subtle"
              mode={theme.mode()}
              className="mr-2"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
      <div className="w-100 talent-table-tabs mt-3 d-flex flex-row align-items-center">
        {mobile && (
          <div
            onClick={() => setActiveTab("Overview")}
            className={`py-2 px-2 ml-3 talent-table-tab${
              activeTab == "Overview" ? " active-talent-table-tab" : ""
            }`}
          >
            Overview
          </div>
        )}
        <div
          onClick={() => setActiveTab("Supporting")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            activeTab == "Supporting" ? " active-talent-table-tab" : ""
          }`}
        >
          Supporting
        </div>
        <div
          onClick={() => setActiveTab("Supporters")}
          className={`py-2 px-2 talent-table-tab${
            activeTab == "Timeline" ? " active-talent-table-tab" : ""
          }`}
        >
          Supporters
        </div>
      </div>
      {activeTab == "Supporting" && (
        <Supporting
          mode={theme.mode()}
          talentTokensInCUSD={talentTokensInCUSD}
          talentTokensInTAL={talentTokensInTAL}
          totalRewardsInCUSD={totalRewardsInCUSD}
          rewardsClaimed={rewardsClaimed()}
          talents={supportedTalents}
          returnValues={returnValues}
          onClaim={onClaim}
        />
      )}
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <ApolloProvider client={client(railsContext.contractsEnv)}>
        <NewPortfolio {...props} railsContext={railsContext} />
      </ApolloProvider>
    </ThemeContainer>
  );
};

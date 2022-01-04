import React, {
  useState,
  useContext,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import Modal from "react-bootstrap/Modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const Supporting = ({ mode, talents, returnValues, onClaim }) => {
  const [talentProfilePictures, setTalentProfilePictures] = useState({});
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(false);

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

  const compareName = (talent1, talent2) => {
    if (talent1.name > talent2.name) {
      return 1;
    } else if (talent1.name < talent2.name) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareAmount = (talent1, talent2) => {
    if (parseFloat(talent1.amount) < parseFloat(talent2.amount)) {
      return 1;
    } else if (parseFloat(talent1.amount) > parseFloat(talent2.amount)) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareRewards = (talent1, talent2) => {
    const talent1Amount = parseFloat(
      returns(talent1.contract_id).replaceAll(",", "")
    );
    const talent2Amount = parseFloat(
      returns(talent2.contract_id).replaceAll(",", "")
    );

    if (talent1Amount < talent2Amount) {
      return 1;
    } else if (talent1Amount > talent2Amount) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortedTalents = () => {
    let desiredTalent = talents;
    if (sortDirection == "asc") {
      let comparisonFunction;

      switch (selectedSort) {
        case "Amount":
          comparisonFunction = compareAmount;
          break;
        case "TAL":
          comparisonFunction = compareAmount;
          break;
        case "Rewards":
          comparisonFunction = compareRewards;
          break;
        case "Alphabetical Order":
          comparisonFunction = compareName;
          break;
      }

      desiredTalent.sort(comparisonFunction);
    } else {
      desiredTalent.reverse();
    }

    return desiredTalent;
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
          {sortedTalents().map((talent) => (
            <Table.Tr
              key={`talent-${talent.contract_id}`}
              className="reset-cursor"
            >
              <Table.Td>
                <div
                  className="d-flex cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/talent/${talent.name}`)
                  }
                >
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
                  type="primary-ghost"
                  mode={mode}
                  className="mr-2 remove-background underline-hover"
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

const RewardsModal = ({
  show,
  setShow,
  claim,
  loadingRewards,
  activeContract,
  rewardValues,
  supportedTalents,
}) => {
  if (!activeContract) {
    return null;
  }
  const availableRewards = rewardValues[activeContract] || "0";
  const activeTalent =
    supportedTalents.find(
      (talent) => talent.contract_id == activeContract.toLowerCase()
    ) || {};

  return (
    <Modal
      scrollable={true}
      show={show}
      centered
      onHide={() => setShow(false)}
      dialogClassName="remove-background"
    >
      <Modal.Body className="show-grid p-4">
        <p>
          <strong className="text-black">Rewards {activeTalent.symbol}</strong>
        </p>
        <p className="text-black">
          Rewards are calculated in real time and are always displayed in $TAL.
        </p>
        <p className="text-black">
          You currently have{" "}
          <strong>{parseAndCommify(availableRewards)} $TAL</strong> accumulated.
        </p>
        <div className="dropdown-divider mt-5 mb-3"></div>
        <div className="d-flex flex-row flex-wrap w-100">
          <div className="d-flex flex-column col-12 col-md-6 justify-content-between ">
            <p className="mr-3 mb-0 text-black">Claim rewards to my wallet.</p>
            <p className="text-muted">
              <small>
                You'll be able to cash out your $TAL rewards to your Metamask
                wallet once we launch the $TAL token next year (subject to flow
                controls). Until then you can see your $TAL balance in your
                Portfolio.
              </small>
            </p>
            <button className="btn btn-primary talent-button" disabled>
              Claim $TAL
            </button>
          </div>
          <div className="dropdown-divider col-12 my-3 d-md-none"></div>
          <div className="d-flex flex-column col-12 col-md-6 justify-content-between">
            <div className="d-flex flex-column mr-3">
              <p className="mb-0 text-black">
                Use my rewards to buy more talent tokens.
              </p>
              <p className="text-muted">
                <small>
                  This will use all your accumulated rewards. If no more talent
                  tokens can be minted the leftover amount will be returned to
                  you.
                </small>
              </p>
            </div>
            <button
              className="btn btn-primary talent-button"
              onClick={claim}
              disabled={loadingRewards}
            >
              Buy ${activeTalent.symbol}{" "}
              {loadingRewards ? <FontAwesomeIcon icon={faSpinner} spin /> : ""}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
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
  const [loadingRewards, setLoadingRewards] = useState(false);

  // --- Interface variables ---
  const { height, width } = useWindowDimensionsHook();
  const mobile = width < 992;
  const theme = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState(
    mobile ? "Overview" : "Supporting"
  );
  const [show, setShow] = useState(false);

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
      <RewardsModal
        show={show}
        setShow={setShow}
        claim={claimRewards}
        loadingRewards={loadingRewards}
        activeContract={activeContract}
        rewardValues={returnValues}
        rewards={returnValues[activeContract] || "0"}
        supportedTalents={supportedTalents}
      />
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

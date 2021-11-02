import React, { useMemo, useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { OnChain } from "src/onchain";
import { parseAndCommify } from "src/onchain/utils";
import Modal from "react-bootstrap/Modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  ApolloProvider,
  useQuery,
  GET_SUPPORTER_PORTFOLIO,
  client,
} from "src/utils/thegraph";

import PortfolioTable from "./PortfolioTable";
import PortfolioTalOverview from "./PortfolioTalOverview";

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
      fullscreen={"md-down"}
      show={show}
      centered
      onHide={() => setShow(false)}
    >
      <Modal.Body className="show-grid p-4">
        <p>
          <strong>Rewards {activeTalent.symbol}</strong>
        </p>
        <p>
          Rewards are calculated in real time and are always displayed in TAL.
        </p>
        <p>
          You currently have{" "}
          <strong>{parseAndCommify(availableRewards)} TAL</strong> accumulated.
        </p>
        <div className="dropdown-divider mt-5 mb-3"></div>
        <div className="d-flex flex-row w-100">
          <div className="d-flex flex-column col-12 col-md-6 justify-content-between ">
            <p className="mr-3">Claim rewards to my wallet.</p>
            <button className="btn btn-primary talent-button" disabled>
              Claim TAL
            </button>
          </div>
          <div className="d-flex flex-column col-12 col-md-6 justify-content-between">
            <div className="d-flex flex-column mr-3">
              <p className="mb-0">Use my rewards to buy more talent tokens.</p>
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
              Buy {activeTalent.symbol}{" "}
              {loadingRewards ? <FontAwesomeIcon icon={faSpinner} spin /> : ""}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const Portfolio = ({ address, railsContext }) => {
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

  return (
    <>
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
      <PortfolioTalOverview
        cUSDBalance={parseFloat(stableBalance)}
        talentTokensTotal={parseFloat(talentTokensSum)}
        rewardsClaimed={parseFloat(rewardsClaimed())}
      />
      <PortfolioTable
        loading={loading}
        talents={supportedTalents}
        returnValues={returnValues}
        onClaim={onClaim}
        // function names on contract are not correct
      />
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client(railsContext.contractsEnv)}>
      <Portfolio {...props} railsContext={railsContext} />
    </ApolloProvider>
  );
};

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { OnChain } from "src/onchain";
import { get } from "src/utils/requests";
import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID,
  client,
} from "src/utils/thegraph";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import AsyncValue from "../loader/AsyncValue";
import TalentTags from "../talent/TalentTags";
import Button from "../button";

const LoadingData = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="6">
      <small>We're loading your portfolio.</small>
    </td>
  </tr>
);

const EmptySupporters = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="6">
      <small>You don't have supporters yet.</small>
    </td>
  </tr>
);

const SupporterOverview = ({
  loading,
  reserve,
  supporterCount,
  talentRewards,
  marketCap,
}) => {
  return (
    <div className="col-12 d-flex flex-row flex-wrap justify-content-between align-items-center mt-3">
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>$TAL staked</small>
          </div>
          {loading || !reserve ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <h4>
              {ethers.utils.commify(Number.parseFloat(reserve).toFixed(2))}
            </h4>
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>Rewards</small>
          </div>
          {loading || !talentRewards ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <h4>
              {ethers.utils.commify(
                Number.parseFloat(talentRewards).toFixed(2)
              )}
            </h4>
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>Market Cap</small>
          </div>
          {loading || !marketCap ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <h4>
              ${ethers.utils.commify(Number.parseFloat(marketCap).toFixed(2))}
            </h4>
          )}
        </div>
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>Supporters</small>
          </div>
          {loading || supporterCount < 0 ? (
            <h4>
              <AsyncValue size={12} />
            </h4>
          ) : (
            <h4>{supporterCount}</h4>
          )}
        </div>
      </div>
    </div>
  );
};

const TalentSupportersTable = ({ talent, contractId, railsContext }) => {
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO_FOR_ID, {
    variables: { id: contractId?.toLowerCase() },
  });
  const [chainAPI, setChainAPI] = useState(null);
  const [returnValues, setReturnValues] = useState({});
  const [supporterProfilePictures, setSupporterProfilePictures] = useState({});
  const [supporterDBIds, setSupporterDBIds] = useState({});

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
        console.log(response);
        setSupporterProfilePictures((prev) => ({
          ...prev,
          [supporter.id]: response.profilePictureUrl,
        }));
        setSupporterDBIds((prev) => ({
          ...prev,
          [supporter.id]: response.id,
        }));
      });
    });
  }, [supporters]);

  const talentData = useMemo(() => {
    if (!data || data.talentToken == null) {
      return {
        totalValueLocked: 0,
        supporterCounter: 0,
        totalSupply: 0,
        marketCap: 0,
      };
    }

    return {
      totalValueLocked: ethers.utils.formatUnits(
        data.talentToken.totalValueLocked
      ),
      supporterCounter: data.talentToken.supporterCounter,
      totalSupply: ethers.utils.formatUnits(data.talentToken.totalSupply),
      marketCap: ethers.utils.formatUnits(data.talentToken.marketCap),
    };
  }, [data]);

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);

    await newOnChain.connectedAccount();
    await newOnChain.loadStaking();

    setChainAPI(newOnChain);
  });

  const loadReturns = async (accountId) => {
    if (chainAPI && accountId) {
      const value = await chainAPI.calculateEstimatedReturns(
        contractId,
        accountId
      );

      return ethers.utils.formatUnits(value.talentRewards);
    }

    return "0";
  };

  const returnsSum = useMemo(() => {
    let sum = ethers.BigNumber.from(0);

    Object.keys(returnValues).map((key) => {
      sum = sum.add(ethers.utils.parseUnits(returnValues[key]));
    });
    return ethers.utils.formatUnits(sum);
  }, [returnValues]);

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

  useEffect(() => {
    setupChain();
  }, []);

  return (
    <div className="table-responsive">
      <div className="d-flex flex-row flex-wrap justify-content-between w-100 pt-3 mb-3">
        <div className="d-flex flex-row col-12 col-lg-6">
          <TalentProfilePicture src={talent.profilePictureUrl} height={96} />
          <div className="d-flex flex-column ml-2">
            <h1 className="h2">
              <small>
                {talent.username}{" "}
                <span className="text-muted">(${talent.ticker})</span>
              </small>
            </h1>
            <TalentTags tags={talent.tags} />
          </div>
        </div>
        <div>
          <button className="btn btn-primary" disabled>
            Claim rewards
          </button>
        </div>
        <SupporterOverview
          supporterCount={supporters.length}
          loading={loading}
          reserve={talentData.totalValueLocked}
          talentRewards={returnsSum}
          marketCap={talentData.marketCap}
        />
      </div>
      <p>These are {talent.username} current supporters.</p>
      <table className="table table-hover mb-0 border-bottom border-left border-right">
        <thead>
          <tr>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Supporter</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Tokens held</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Staking rewards</small>
            </th>
            <th
              className="tal-th py-1 text-right text-muted border-bottom-0"
              scope="col"
            >
              <small>Actions</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && <LoadingData />}
          {!loading && supporters.length == 0 && <EmptySupporters />}
          {supporters.map((supporter) => (
            <tr key={`supporter-${supporter.id}`} className="tal-tr-item">
              <th className="text-muted align-middle">
                <TalentProfilePicture
                  src={supporterProfilePictures[supporter.id]}
                  height={40}
                />
                <small className="ml-2 text-primary">{supporter.id}</small>
              </th>
              <td className="align-middle text-right">
                <small>
                  <AsyncValue value={supporter.amount} size={10} />
                </small>
              </td>

              <td className="align-middle text-right">
                <small>
                  <AsyncValue
                    value={ethers.utils.commify(
                      returnValues[supporter.id] || ""
                    )}
                    size={10}
                  />
                </small>
              </td>
              <td className="align-middle text-right">
                <Button
                  type="primary"
                  text="Message"
                  disabled={!supporterDBIds[supporter.id]}
                  href={`/messages?user=${supporterDBIds[supporter.id]}`}
                  size="sm"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client(railsContext.contractsEnv)}>
      <TalentSupportersTable {...props} railsContext={railsContext} />
    </ApolloProvider>
  );
};

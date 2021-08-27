import React, { useContext, useMemo, useState } from "react";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

import Button from "../button";
import DisplayTokenVariance from "../token/DisplayTokenVariance";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import AsyncValue from "../loader/AsyncValue";

import { get } from "src/utils/requests";

const EmptyInvestments = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="7">
      <small>Sponsor Talent to start building your portfolio.</small>
    </td>
    <td className="align-middle" colSpan="1">
      <Button type="primary" text="See Talent" href="/talent" size="sm" />
    </td>
  </tr>
);

const Web3Loading = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="7">
      <small>We're loading your portfolio.</small>
    </td>
    <td className="align-middle" colSpan="1">
      <Button type="primary" text="See Talent" href="/talent" size="sm" />
    </td>
  </tr>
);

const PortfolioTokenTable = () => {
  const web3 = useContext(Web3Context);
  const [tokenAPIData, setTokenAPIData] = useState({});

  const tokenInDollar = (token) => {
    if (token) {
      return (token.dollarPerToken * web3.talToken.price).toFixed(2);
    }
  };

  const tokensWithBalance = useMemo(() => {
    const relevantTokens = Object.keys(web3.tokens).filter(
      (address) => web3.tokens[address].balance > 0
    );

    relevantTokens.forEach((address) => {
      get(`/api/v1/tokens/${address}`).then(
        (result) =>
          result.id &&
          setTokenAPIData((prev) => ({ ...prev, [address]: result }))
      );
    });

    return relevantTokens.map((key) => web3.tokens[key]);
  }, [web3.tokens]);

  return (
    <div className="table-responsive">
      <h3>Talent</h3>
      <table className="table table-hover mb-0 border-bottom border-left border-right">
        <thead>
          <tr>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Talent</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0"
              scope="col"
            ></th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Name</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Amount held</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Token Value</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Total</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>7d %</small>
            </th>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Actions</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {web3.loading && <Web3Loading />}
          {!web3.loading && tokensWithBalance.length == 0 && (
            <EmptyInvestments />
          )}
          {tokensWithBalance.map((token) => (
            <tr key={`transaction-${token.address}`} className="tal-tr-item">
              <th className="text-muted align-middle">
                <TalentProfilePicture
                  src={tokenAPIData[token.address]?.profilePictureUrl}
                  height={40}
                />
              </th>
              <th className="align-middle pr-0 text-primary" scope="row">
                <small>
                  {web3.loading ? <AsyncValue /> : `$${token.symbol}`}
                </small>
              </th>
              <td className="align-middle text-right">
                <small>{web3.loading ? <AsyncValue /> : `${token.name}`}</small>
              </td>
              <td className="align-middle text-right">
                <small>
                  <AsyncValue value={token.balance} size={10} />
                </small>
              </td>
              <td className="align-middle tal-table-price text-right">
                {web3.loading ? <AsyncValue /> : `$${tokenInDollar(token)}`}
                <br />
                <span className="text-muted">
                  <small>
                    {web3.loading ? (
                      <AsyncValue size={5} />
                    ) : (
                      `${token.dollarPerToken.toFixed(2)} ✦`
                    )}
                  </small>
                </span>
              </td>
              <td className="align-middle tal-table-price text-right">
                {web3.loading ? (
                  <AsyncValue size={5} />
                ) : (
                  `$${(tokenInDollar(token) * token.balance).toFixed(2)}`
                )}
                <br />
                <span className="text-muted">
                  <small>
                    {web3.loading ? (
                      <AsyncValue size={5} />
                    ) : (
                      `${(
                        token.dollarPerToken.toFixed(2) * token.balance
                      ).toFixed(2)} ✦`
                    )}
                  </small>
                </span>
              </td>
              <td className="align-middle text-right">
                {web3.loading ? (
                  <div>
                    <AsyncValue size={5} />
                  </div>
                ) : (
                  <DisplayTokenVariance
                    variance={tokenAPIData[token.address]?.variance7d || "0"}
                  />
                )}
              </td>
              <td className="align-middle">
                <Button
                  type="primary"
                  text="See Talent"
                  href={`/talent/${token.symbol}`}
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

const ConnectedTokenTable = (props) => (
  <Web3Container>
    <PortfolioTokenTable {...props} />
  </Web3Container>
);

export default ConnectedTokenTable;

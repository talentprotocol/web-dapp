import React, { useContext } from "react";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

import Button from "../button";
import DisplayTokenVariance from "../token/DisplayTokenVariance";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import AsyncValue from "../loader/AsyncValue";

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

const PortfolioTokenTable = ({ tokens }) => {
  const web3 = useContext(Web3Context);

  const amountForToken = (token) => web3.tokens[token.contract_id]?.balance;

  const tokenInTal = (token) => {
    if (web3.tokens[token.contract_id]) {
      return web3.tokens[token.contract_id]?.dollarPerToken.toFixed(2);
    }
  };

  const tokenInDollar = (token) => {
    if (web3.tokens[token.contract_id]) {
      return (
        web3.tokens[token.contract_id]?.dollarPerToken * web3.talToken?.price
      ).toFixed(2);
    }
  };

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
          {tokens.length == 0 && <EmptyInvestments />}
          {tokens.map((token) => (
            <tr key={`transaction-${token.id}`} className="tal-tr-item">
              <th className="text-muted align-middle">
                <TalentProfilePicture
                  src={token.profilePictureUrl}
                  height={40}
                />
              </th>
              <th className="align-middle pr-0 text-primary" scope="row">
                <small>{token.ticker}</small>
              </th>
              <td className="align-middle text-right">
                <small>{token.talentName}</small>
              </td>
              <td className="align-middle text-right">
                <small>
                  <AsyncValue value={amountForToken(token)} size={10} />
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
                      `${tokenInTal(token)} ✦`
                    )}
                  </small>
                </span>
              </td>
              <td className="align-middle tal-table-price text-right">
                {web3.loading ? (
                  <AsyncValue size={5} />
                ) : (
                  `$${(tokenInDollar(token) * amountForToken(token)).toFixed(
                    2
                  )}`
                )}
                <br />
                <span className="text-muted">
                  <small>
                    {web3.loading ? (
                      <AsyncValue size={5} />
                    ) : (
                      `${(tokenInTal(token) * amountForToken(token)).toFixed(
                        2
                      )} ✦`
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
                  <DisplayTokenVariance variance={token.priceVariance7d} />
                )}
              </td>
              <td className="align-middle">
                <Button
                  type="primary"
                  text="See Talent"
                  href={token.talentUrl}
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

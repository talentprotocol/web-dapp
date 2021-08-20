import React from "react";
import Button from "../button";
import DisplayTokenVariance from "../token/DisplayTokenVariance";
import TalentProfilePicture from "../talent/TalentProfilePicture";

const EmptyInvestments = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="6">
      <small>Sponsor Talent to start building your portfolio.</small>
    </td>
    <td className="align-middle" colSpan="1">
      <Button type="primary" text="See Talents" href="/talent" size="sm" />
    </td>
  </tr>
);

const PortfolioTokenTable = ({ tokens }) => {
  return (
    <div className="table-responsive">
      <h3>Talents</h3>
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
                <small>{token.amount}</small>
              </td>
              <td className="align-middle tal-table-price text-right">
                {token.price}
                <br />
                <span className="text-muted">
                  <small>{token.priceInTal}</small>
                </span>
              </td>
              <td className="align-middle tal-table-price text-right">
                {token.value}
                <br />
                <span className="text-muted">
                  <small>{token.valueInTal}</small>
                </span>
              </td>
              <td className="align-middle text-right">
                <DisplayTokenVariance variance={token.priceVariance7d} />
              </td>
              <td className="align-middle">
                <Button
                  type="primary"
                  text="Transactions"
                  href={token.tokenUrl}
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

export default PortfolioTokenTable;

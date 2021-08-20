import React from "react";
import Button from "../button";
import DisplayTokenVariance from "../token/DisplayTokenVariance";

const EmptyInvestments = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="6">
      <small>No transactions for this talent token.</small>
    </td>
    <td className="align-middle" colSpan="1">
      <Button type="primary" text="See Talents" href="/talent" size="sm" />
    </td>
  </tr>
);

const PortfolioTransactionTable = ({ transactions }) => {
  return (
    <div className="table-responsive">
      <h3>Transactions</h3>
      <table className="table table-hover mb-0 border-bottom border-left border-right">
        <thead>
          <tr>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Transaction ID</small>
            </th>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Description</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Amount</small>
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
          {transactions.length == 0 && <EmptyInvestments />}
          {transactions.map((transaction) => (
            <tr key={`transaction-${transaction.id}`} className="tal-tr-item">
              <th className="text-muted align-middle">
                <small>{transaction.transactionId.substring(0, 10)}..</small>
              </th>
              <th className="align-middle pr-0 text-primary" scope="row">
                {transaction.inbound && (
                  <small>
                    $TAL {"->"} {transaction.tokenTicker}
                  </small>
                )}
                {!transaction.inbound && (
                  <small>
                    {transaction.tokenTicker} {"->"} $TAL
                  </small>
                )}
              </th>
              <td className="align-middle text-right">
                <small>
                  {transaction.amount + " -> " + transaction.amount}
                </small>
              </td>
              <td className="align-middle tal-table-price text-right">
                {transaction.price}
                <br />
                <span className="text-muted">
                  <small>{transaction.priceInTal}</small>
                </span>
              </td>
              <td className="align-middle tal-table-price text-right">
                {transaction.value}
                <br />
                <span className="text-muted">
                  <small>{transaction.valueInTal}</small>
                </span>
              </td>
              <td className="align-middle text-right">
                <DisplayTokenVariance variance={transaction.priceVariance7d} />
              </td>
              <td className="align-middle">
                <Button
                  type="primary"
                  text="View"
                  href={transaction.talentUrl}
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

export default PortfolioTransactionTable;

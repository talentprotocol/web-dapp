import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Button from "../button";
import TalentProfilePicture from "../talent/TalentProfilePicture";

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

const PortfolioTable = ({ loading, talents, loadReturns }) => {
  const [returnValues, setReturnValues] = useState({});

  const updateAll = async () => {
    talents.forEach((element) => {
      loadReturns(element.contract_id).then((returns) =>
        setReturnValues((prev) => ({
          ...prev,
          [element.id]: returns,
        }))
      );
    });
  };

  useEffect(() => {
    updateAll();
  }, [talents]);

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
              <small>Market Cap</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>7d %</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Yield</small>
            </th>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Actions</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && <Web3Loading />}
          {!loading && talents.length == 0 && <EmptyInvestments />}
          {talents.map((talent) => (
            <tr key={`talent-${talent.id}`} className="tal-tr-item">
              <th className="text-muted align-middle">
                <TalentProfilePicture src={undefined} height={40} />
              </th>
              <th className="align-middle pr-0 text-primary" scope="row">
                {talent.symbol}
              </th>
              <td className="align-middle text-right">{talent.name}</td>
              <td className="align-middle text-right">{talent.amount}</td>
              <td className="align-middle tal-table-price text-right">
                {talent.totalSupply}
              </td>
              <td className="align-middle text-right">0%</td>
              <td className="align-middle tal-table-price text-right">
                {returnValues[talent.id]}
              </td>
              <td className="align-middle">
                <Button
                  type="primary"
                  text="See Talent"
                  href={`/talent/${talent.name}`}
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

export default PortfolioTable;

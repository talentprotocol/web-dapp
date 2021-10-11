import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Button from "../button";
import TalentProfilePicture from "../talent/TalentProfilePicture";

import { get } from "src/utils/requests";

const EmptyInvestments = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="6">
      <small>Support Talent to start building your portfolio.</small>
    </td>
    <td className="align-middle" colSpan="1">
      <Button type="primary" text="See Talent" href="/talent" size="sm" />
    </td>
  </tr>
);

const Web3Loading = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="6">
      <small>We're loading your portfolio.</small>
    </td>
    <td className="align-middle" colSpan="1">
      <Button type="primary" text="See Talent" href="/talent" size="sm" />
    </td>
  </tr>
);

const PortfolioTable = ({
  loading,
  talents,
  returnValues,
  unstake,
  withdraw,
  claim,
}) => {
  const [talentProfilePictures, setTalentProfilePictures] = useState({});

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
            <tr key={`talent-${talent.contract_id}`} className="tal-tr-item">
              <th className="text-muted align-middle">
                <TalentProfilePicture
                  src={talentProfilePictures[talent.contract_id]}
                  height={40}
                />
              </th>
              <th className="align-middle pr-0 text-primary" scope="row">
                <a className="text-reset" href={`/talent/${talent.name}`}>
                  {talent.symbol}
                </a>
              </th>
              <td className="align-middle text-right">{talent.name}</td>
              <td className="align-middle text-right">{talent.amount}</td>
              <td className="align-middle tal-table-price text-right">
                ${ethers.utils.commify(talent.totalSupply * 0.1)}
              </td>
              <td className="align-middle tal-table-price text-right">
                {returnValues[talent.id] &&
                  ethers.utils.commify(returnValues[talent.id].toString())}
              </td>
              <td className="align-middle">
                <button
                  className="btn btn-sm btn-danger ml-2 my-1"
                  onClick={unstake}
                  disabled
                >
                  Unstake
                </button>
                <button
                  className="btn btn-sm btn-light ml-2 my-1"
                  onClick={withdraw}
                  disabled
                >
                  Withdraw
                </button>
                <button
                  className="btn btn-sm btn-primary ml-2 my-1"
                  onClick={() => claim(talent.contract_id)}
                >
                  Claim
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;

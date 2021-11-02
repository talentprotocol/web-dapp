import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { parseAndCommify } from "src/onchain/utils";
import Button from "../button";
import TalentProfilePicture from "../talent/TalentProfilePicture";

import { get } from "src/utils/requests";

const EmptyInvestments = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="4">
      <small>Support Talent to start building your portfolio.</small>
    </td>
    <td className="align-middle" colSpan="1">
      <Button type="primary" text="See Talent" href="/talent" size="sm" />
    </td>
  </tr>
);

const Web3Loading = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="4">
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
  claim,
  restake,
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
      <button className="btn btn-primary active mt-5 mb-4">Supporting</button>
      <table className="table table-hover mb-0 border-bottom">
        <thead>
          <tr>
            <th
              className="tal-th py-1 border-bottom-0 border-top-0"
              scope="col"
            >
              <span>
                <small>
                  <strong>TALENT</strong>
                </small>
              </span>
            </th>
            <th
              className="tal-th py-1 border-bottom-0 border-top-0"
              scope="col"
            >
              <small>
                <strong>AMOUNT</strong>
              </small>
            </th>
            <th
              className="tal-th py-1 border-bottom-0 border-top-0"
              scope="col"
            >
              <small>
                <strong>TAL LOCKED</strong>
              </small>
            </th>
            <th
              className="tal-th py-1 border-bottom-0 border-top-0"
              scope="col"
            >
              <small>
                <strong>TAL REWARDS</strong>
              </small>
            </th>
            <th
              className="tal-th py-1 border-bottom-0 border-top-0"
              scope="col"
            >
              <small>
                <strong>ACTION</strong>
              </small>
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && <Web3Loading />}
          {!loading && talents.length == 0 && <EmptyInvestments />}
          {talents.map((talent) => (
            <tr key={`talent-${talent.contract_id}`} className="tal-tr-item">
              <th className="text-dark align-middle">
                <div className="w-100 d-flex flex-row align-items-center">
                  <TalentProfilePicture
                    src={talentProfilePictures[talent.contract_id]}
                    height={40}
                  />
                  <a
                    className="text-reset ml-3"
                    href={`/talent/${talent.name}`}
                  >
                    <strong>{talent.name}</strong>
                    <span className="ml-2 text-muted">{talent.symbol}</span>
                  </a>
                </div>
              </th>
              <td className="align-middle">{parseAndCommify(talent.amount)}</td>
              <td className="align-middle tal-table-price">
                {parseAndCommify(talent.talAmount)}
              </td>
              <td className="align-middle tal-table-price">
                {returnValues[talent.contract_id] &&
                  parseAndCommify(returnValues[talent.contract_id].toString())}
              </td>
              <td className="align-middle">
                <button
                  className="btn btn-sm btn-link text-primary ml-2 my-1"
                  onClick={unstake}
                  disabled
                >
                  <strong>Unstake</strong>
                </button>
                <button
                  className="btn btn-sm btn-link text-primary ml-2 my-1"
                  onClick={claim}
                  disabled
                >
                  <strong>Claim</strong>
                </button>
                <button
                  className="btn btn-sm btn-link text-primary ml-2 my-1"
                  onClick={() => restake(talent.contract_id)}
                >
                  <strong>Stake Rewards</strong>
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

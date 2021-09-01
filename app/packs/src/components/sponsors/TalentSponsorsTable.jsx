import React, { useContext, useState, useEffect } from "react";
import currency from "currency.js";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import AsyncValue from "../loader/AsyncValue";
import TalentTags from "../talent/TalentTags";
import Button from "../button";

const EmptySponsors = () => (
  <tr>
    <td className="align-middle text-muted" colSpan="5">
      <small>You don't have sponsors yet.</small>
    </td>
  </tr>
);

const SponsorOverview = ({ loading, reserve, sponsorCount }) => {
  return (
    <div className="col-12 col-lg-6 d-flex flex-row align-items-center">
      <div className="col-6 d-flex flex-column align-items-center border bg-white px-3">
        <div className="text-muted">
          <small>$TAL in reserve</small>
        </div>
        {loading || !reserve ? (
          <h4>
            <AsyncValue size={12} />
          </h4>
        ) : (
          <h4>
            {currency(reserve / 100.0)
              .format()
              .substring(1)}
          </h4>
        )}
      </div>
      <div className="col-6 d-flex flex-column align-items-center border bg-white px-3 ml-2">
        <div className="text-muted">
          <small>Sponsors</small>
        </div>
        <h4>{sponsorCount}</h4>
      </div>
    </div>
  );
};

const TalentSponsorsTable = ({ talent, contractId, sponsors }) => {
  const [token, setToken] = useState(null);
  const [sponsorBalances, setSponsorBalances] = useState({});
  const web3 = useContext(Web3Context);

  useEffect(() => {
    web3.getToken(contractId).then((loadedToken) => setToken(loadedToken));
  }, [web3.loading]);

  useEffect(() => {
    if (token) {
      sponsors.forEach((s) => loadBalance(s.walletId));
    }
  }, [token]);

  const loadBalance = async (address) => {
    if (token?.contract) {
      const result = await token.contract.methods.balanceOf(address).call();
      setSponsorBalances((prev) => ({
        ...prev,
        [address]: currency(result / 100.0)
          .format()
          .substring(1),
      }));
    }
  };

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
        <SponsorOverview
          sponsorCount={sponsors.length}
          loading={web3.loading}
          reserve={token?.reserve}
        />
      </div>
      <p>These are the current holders of your token.</p>
      <table className="table table-hover mb-0 border-bottom border-left border-right">
        <thead>
          <tr>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Sponsor</small>
            </th>
            <th
              className="tal-th py-1 text-muted border-bottom-0 text-right"
              scope="col"
            >
              <small>Amount held</small>
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
          {!web3.loading && sponsors.length == 0 && <EmptySponsors />}
          {sponsors.map((sponsor) => (
            <tr key={`sponsor-${sponsor.id}`} className="tal-tr-item">
              <th className="text-muted align-middle">
                <TalentProfilePicture
                  src={sponsor.profilePictureUrl}
                  height={40}
                />
                <small className="ml-2 text-primary">{sponsor.username}</small>
              </th>
              <td className="align-middle text-right">
                <small>
                  <AsyncValue
                    value={sponsorBalances[sponsor.walletId]}
                    size={10}
                  />
                </small>
              </td>
              <td className="align-middle text-right">
                <Button
                  type="primary"
                  text="Message"
                  href={`/messages?user=${sponsor.id}`}
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

const ConnectedTalentSponsorsTable = (props) => (
  <Web3Container ignoreTokens={true}>
    <TalentSponsorsTable {...props} />
  </Web3Container>
);

export default ConnectedTalentSponsorsTable;

import React, { useContext, useState, useEffect } from "react";
import currency from "currency.js";

import Web3Container, { Web3Context } from "src/contexts/web3Context";

import TalentProfilePicture from "../talent/TalentProfilePicture";
import AsyncValue from "../loader/AsyncValue";
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
    <div className="d-flex flex-row flex-wrap pt-3 pb-4 align-items-center">
      <div className="col-12 col-sm-6 col-md-3 mt-2 pr-1 pl-0">
        <div className="d-flex flex-column align-items-center border bg-white">
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
      </div>
      <div className="col-12 col-sm-6 col-md-3 mt-2 pl-1 pr-0">
        <div className="d-flex flex-column align-items-center border bg-white">
          <div className="text-muted">
            <small>Sponsors</small>
          </div>
          <h4>{sponsorCount}</h4>
        </div>
      </div>
    </div>
  );
};

const TalentSponsorsTable = ({ contractId, sponsors }) => {
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
      <SponsorOverview
        sponsorCount={sponsors.length}
        loading={web3.loading}
        reserve={token?.reserve}
      />
      <p>These are the current holders of your token.</p>
      <table className="table table-hover mb-0 border-bottom border-left border-right">
        <thead>
          <tr>
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
              <small>Sponsor</small>
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
            <th className="tal-th py-1 text-muted border-bottom-0" scope="col">
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
              </th>
              <th className="align-middle pr-0 text-primary" scope="row">
                <small>
                  {web3.loading || token == undefined ? (
                    <AsyncValue />
                  ) : (
                    `$${token.symbol}`
                  )}
                </small>
              </th>
              <td className="align-middle text-right">
                <small>
                  {web3.loading || token == undefined ? (
                    <AsyncValue />
                  ) : (
                    `${token.name}`
                  )}
                </small>
              </td>
              <td className="align-middle text-right">
                <small>
                  <AsyncValue
                    value={sponsorBalances[sponsor.walletId]}
                    size={10}
                  />
                </small>
              </td>
              <td className="align-middle">
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

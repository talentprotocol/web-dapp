import React, { useState } from "react";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ethers } from "ethers";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  client,
} from "src/utils/thegraph";
import { post, destroy } from "src/utils/requests";

import TalentProfilePicture from "./TalentProfilePicture";
import Table from "src/components/design_system/table";
import P2 from "src/components/design_system/typography/p2";
import Caption from "src/components/design_system/typography/caption";

const TalentTable = ({ talents }) => {
  const [changingFollow, setChangingFollow] = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO);
  const [sortDirection, setSortDirection] = useState("asc");
  const getInitialFollows = () => {
    const allFollows = {};

    talents.forEach((talent) => {
      allFollows[talent.id] = talent.isFollowing;
    });

    return allFollows;
  };

  const [follows, setFollows] = useState(getInitialFollows());

  const toggleWatchlist = async (talent) => {
    setChangingFollow(true);
    if (talent.isFollowing) {
      const response = await destroy(
        `/api/v1/follows?user_id=${talent.user_id}`
      ).catch(() => setChangingFollow(false));

      if (response.success) {
        setFollows((prev) => ({ ...prev, [talent.id]: false }));
      }
    } else {
      const response = await post(`/api/v1/follows`, {
        user_id: talent.user_id,
      }).catch(() => setChangingFollow(false));

      if (response.success) {
        setFollows((prev) => ({ ...prev, [talent.id]: true }));
      }
    }
    setChangingFollow(false);
  };

  const getSponsorCount = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(chosenTalent.supporterCounter);
    }
    return 0;
  };

  const getCirculatingSupply = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(
        ethers.utils.formatUnits(chosenTalent.totalSupply)
      );
    }
    return 0;
  };

  const getProgress = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      const value = ethers.BigNumber.from(chosenTalent.totalSupply)
        .mul(100)
        .div(chosenTalent.maxSupply)
        .toNumber();

      if (value < 1) {
        return 1;
      } else {
        return value;
      }
    }
    return 0;
  };

  const compareUsername = (talent1, talent2) => {
    if (talent1.username > talent2.username) {
      return 1;
    } else if (talent1.username < talent2.username) {
      return -1;
    } else {
      return 0;
    }
  };

  const filteredTalents = () => {
    let desiredTalent = talents;
    if (watchlistOnly) {
      desiredTalent = talents.filter((talent) => !!follows[talent.id]);
    }
    if (sortDirection == "asc") {
      desiredTalent.sort(compareUsername);
    } else {
      desiredTalent.reverse();
    }

    return desiredTalent;
  };

  const toggleDirection = () => {
    if (sortDirection == "asc") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  };

  return (
    <>
      <div className="w-100 talent-table-tabs mt-3 d-flex flex-row">
        <div
          onClick={() => setWatchlistOnly(false)}
          className={`py-2 px-2 talent-table-tab${
            !watchlistOnly ? " active-talent-table-tab" : ""
          }`}
        >
          All Active Talent
        </div>
        <div
          onClick={() => setWatchlistOnly(true)}
          className={`py-2 px-2 talent-table-tab${
            watchlistOnly ? " active-talent-table-tab" : ""
          }`}
        >
          Watchlist
        </div>
      </div>
      <Table mode={"dark"} className="px-3">
        <Table.Head>
          <Table.Th>
            <Caption bold text="" />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={toggleDirection}
              bold
              text={`TALENT ${sortDirection == "asc" ? "▼" : "▲"}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption bold text="OCCUPATION" />
          </Table.Th>
          <Table.Th>
            <Caption bold text="SUPPORTERS" />
          </Table.Th>
          <Table.Th>
            <Caption bold text="CIRCULATING SUPPLY" />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {filteredTalents().map((talent) => (
            <Table.Tr
              key={`talent-${talent.contract_id}`}
              onClick={() =>
                (window.location.href = `/talent/${talent.username}`)
              }
            >
              <Table.Td>
                <button
                  className="btn border-0 text-warning"
                  onClick={() => toggleWatchlist(talent)}
                  disabled={changingFollow}
                >
                  {follows[talent.id] ? (
                    <FontAwesomeIcon icon={faStar} />
                  ) : (
                    <FontAwesomeIcon icon={faStarOutline} />
                  )}
                </button>
              </Table.Td>
              <Table.Td>
                <div className="d-flex">
                  <TalentProfilePicture
                    src={talent.profilePictureUrl}
                    height="24"
                  />
                  <P2 text={talent.username} bold className="ml-2" />
                </div>
              </Table.Td>
              <Table.Td>
                <P2 text={talent.occupation} />
              </Table.Td>
              <Table.Td>
                <P2 text={`${getSponsorCount(talent.contract_id)}`} />
              </Table.Td>
              <Table.Td className="pr-3">
                <P2
                  text={`${getCirculatingSupply(talent.contract_id)} ${
                    talent.ticker
                  }`}
                />
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    aria-valuenow={getProgress(talent.contract_id)}
                    style={{ width: `${getProgress(talent.contract_id)}%` }}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ApolloProvider client={client(railsContext.contractsEnv)}>
      <TalentTable {...props} />
    </ApolloProvider>
  );
};

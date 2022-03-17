import React, { useEffect, useMemo, useState, useContext } from "react";
import { ethers } from "ethers";
import { parseAndCommify } from "src/onchain/utils";
import {
  ApolloProvider,
  useQuery,
  GET_SUPPORTER_PORTFOLIO,
  client,
} from "src/utils/thegraph";
import { get, post, destroy } from "src/utils/requests";
import { camelCaseObject } from "src/utils/transformObjects";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import { H5 } from "src/components/design_system/typography";
import { Spinner } from "src/components/icons";
import TalentTableListMode from "src/components/talent/TalentTableListMode";
import TalentTableCardMode from "src/components/talent/TalentTableCardMode";
import SupportingOptions from "./SupportingOptions";

const Supporting = ({
  wallet,
  setSupportingCount,
  publicPageViewer,
  withOptions = true,
  listMode = false,
}) => {
  const urlParams = new URLSearchParams(document.location.search);
  const theme = useContext(ThemeContext);

  const [localTalents, setLocalTalents] = useState([]);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [listModeOnly, setListModeOnly] = useState(listMode);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [nameSearch, setNameSearch] = useState(urlParams.get("name") || "");

  const { loading, data } = useQuery(GET_SUPPORTER_PORTFOLIO, {
    variables: { id: wallet?.toLowerCase() },
  });

  const getSupporterCount = (contractId) => {
    if (loading || !data) {
      return "0";
    }

    const chosenTalent = data.supporter.talents.find(
      (element) => element.talent.id == contractId?.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(chosenTalent.talent.supporterCounter);
    }
    return "-1";
  };

  const getMarketCap = (contractId) => {
    if (loading || !data) {
      return "0";
    }

    const chosenTalent = data.supporter.talents.find(
      (element) => element.talent.id == contractId?.toLowerCase()
    );

    if (chosenTalent) {
      const totalSupply = ethers.utils.formatUnits(
        chosenTalent.talent.totalSupply
      );
      return parseAndCommify(totalSupply * 0.1);
    }
    return "-1";
  };

  const getProgress = (contractId) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.supporter.talents.find(
      (element) => element.talent.id == contractId?.toLowerCase()
    );

    if (chosenTalent) {
      const value = ethers.BigNumber.from(chosenTalent.talent.totalSupply)
        .mul(100)
        .div(chosenTalent.talent.maxSupply)
        .toNumber();

      if (value < 1) {
        return 1;
      } else {
        return value;
      }
    }
    return 0;
  };

  const changeTab = (tab) => {
    setWatchlistOnly(tab === "Watchlist" ? true : false);
  };

  const updateFollow = async (talent) => {
    const newLocalTalents = localTalents.map((currTalent) => {
      if (currTalent.id === talent.id) {
        return { ...currTalent, isFollowing: !talent.isFollowing };
      } else {
        return { ...currTalent };
      }
    });

    if (talent.isFollowing) {
      const response = await destroy(
        `/api/v1/follows?user_id=${talent.userId}`
      );

      if (response.success) {
        setLocalTalents([...newLocalTalents]);
      }
    } else {
      const response = await post(`/api/v1/follows`, {
        user_id: talent.userId,
      });

      if (response.success) {
        setLocalTalents([...newLocalTalents]);
      }
    }
  };

  const compareName = (talent1, talent2) => {
    const name1 = talent1.user.name.toLowerCase() || "";
    const name2 = talent2.user.name.toLowerCase() || "";

    if (name1 > name2) {
      return 1;
    } else if (name1 < name2) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareOccupation = (talent1, talent2) => {
    const occupation1 = talent1.occupation?.toLowerCase() || "";
    const occupation2 = talent2.occupation?.toLowerCase() || "";

    if (occupation1 < occupation2) {
      return 1;
    } else if (occupation1 > occupation2) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareSupporters = (talent1, talent2) =>
    getSupporterCount(talent1.token.contractId) -
    getSupporterCount(talent2.token.contractId);

  const compareMarketCap = (talent1, talent2) => {
    const talent1Amount = ethers.utils.parseUnits(
      getMarketCap(talent1.token.contractId).replaceAll(",", "")
    );
    const talent2Amount = ethers.utils.parseUnits(
      getMarketCap(talent2.token.contractId).replaceAll(",", "")
    );

    if (talent1Amount.gt(talent2Amount)) {
      return 1;
    } else if (talent1Amount.lt(talent2Amount)) {
      return -1;
    } else {
      return 0;
    }
  };

  const filteredTalents = useMemo(() => {
    let desiredTalent = [...localTalents];
    if (watchlistOnly) {
      desiredTalent = localTalents.filter((talent) => talent.isFollowing);
    }
    if (nameSearch) {
      desiredTalent = localTalents.filter(
        (talent) =>
          talent.user.displayName
            .toLowerCase()
            .includes(nameSearch.toLowerCase()) ||
          talent.user.username
            .toLowerCase()
            .includes(nameSearch.toLowerCase()) ||
          talent.token.ticker.toLowerCase().includes(nameSearch.toLowerCase())
      );
    }
    let comparisonFunction;

    switch (selectedSort) {
      case "Supporters":
        comparisonFunction = compareSupporters;
        break;
      case "Occupation":
        comparisonFunction = compareOccupation;
        break;
      case "Market Cap":
        comparisonFunction = compareMarketCap;
        break;
      case "Alphabetical Order":
        comparisonFunction = compareName;
        break;
    }

    if (sortDirection === "asc") {
      desiredTalent.sort(comparisonFunction).reverse();
    } else if (sortDirection === "desc") {
      desiredTalent.sort(comparisonFunction);
    }

    return desiredTalent;
  }, [localTalents, watchlistOnly, selectedSort, sortDirection, nameSearch]);

  const populateTalents = async () => {
    const newLocalTalents = [...localTalents];

    for (const talent of data.supporter.talents) {
      const response = await get(
        `/api/v1/talent/${talent.talent.id.toLowerCase()}`
      );
      if (response) {
        const index = localTalents.findIndex(
          (localTalent) => localTalent.id === response.id
        );
        if (index > -1) {
          newLocalTalents[index] = camelCaseObject(response);
        } else {
          newLocalTalents.push(camelCaseObject(response));
        }
      }
    }
    setLocalTalents(newLocalTalents);
  };

  useEffect(() => {
    if (data?.supporter !== undefined) {
      if (setSupportingCount) {
        setSupportingCount(data.supporter.talents.length);
      }

      populateTalents();
    }
  }, [data?.supporter]);

  if (loading) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-6">
        <H5 bold text="Supporting" />
        {withOptions && (
          <SupportingOptions
            changeTab={changeTab}
            listModeOnly={listModeOnly}
            setListModeOnly={setListModeOnly}
            setNameSearch={setNameSearch}
            publicPageViewer={publicPageViewer}
          />
        )}
      </div>
      {listModeOnly ? (
        <TalentTableListMode
          theme={theme}
          talents={filteredTalents}
          getProgress={getProgress}
          getMarketCap={getMarketCap}
          getSupporterCount={getSupporterCount}
          updateFollow={updateFollow}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          publicPageViewer={publicPageViewer}
        />
      ) : (
        <TalentTableCardMode
          talents={filteredTalents}
          getMarketCap={getMarketCap}
          getSupporterCount={getSupporterCount}
          updateFollow={updateFollow}
          publicPageViewer={publicPageViewer}
        />
      )}
    </>
  );
};

export default (props) => (
  <ThemeContainer {...props}>
    <ApolloProvider client={client(props.railsContext.contractsEnv)}>
      <Supporting {...props} />
    </ApolloProvider>
  </ThemeContainer>
);

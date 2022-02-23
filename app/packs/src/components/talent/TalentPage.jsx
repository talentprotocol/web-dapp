import React, { useState, useContext, useMemo } from "react";
import { ethers } from "ethers";
import { parseAndCommify } from "src/onchain/utils";
import { useWindowDimensionsHook } from "src/utils/window";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  client,
} from "src/utils/thegraph";
import { post, destroy } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import { H3, P1, P2 } from "src/components/design_system/typography";
import TalentTableListMode from "./TalentTableListMode";
import TalentTableCardMode from "./TalentTableCardMode";
import TalentOptions from "./TalentOptions";

import cx from "classnames";

const TalentPage = ({ talents }) => {
  const theme = useContext(ThemeContext);
  const { mobile } = useWindowDimensionsHook();
  const [localTalents, setLocalTalents] = useState(talents);
  const { loading, data } = useQuery(GET_TALENT_PORTFOLIO, {
    variables: {
      ids: localTalents
        .map((talent) => talent.token.contractId)
        .filter((id) => id),
    },
  });
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [listModeOnly, setListModeOnly] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const getSupporterCount = (contractId) => {
    if (loading || !data) {
      return "0";
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contractId?.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(chosenTalent.supporterCounter);
    }
    return "-1";
  };

  const getMarketCap = (contractId) => {
    if (loading || !data) {
      return "0";
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contractId?.toLowerCase()
    );

    if (chosenTalent) {
      const totalSupply = ethers.utils.formatUnits(chosenTalent.totalSupply);
      return parseAndCommify(totalSupply * 0.1);
    }
    return "-1";
  };

  const getProgress = (contractId) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contractId?.toLowerCase()
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
  }, [localTalents, watchlistOnly, selectedSort, sortDirection, data]);

  return (
    <div className={cx("pb-6", mobile && "p-4")}>
      <div className="mb-5">
        <H3 className="text-black mb-3" bold text="Explore All Talent" />
        <P1
          className="text-primary-03"
          text="Support undiscovered talent and be rewarded as they grow."
        />
      </div>
      <TalentOptions
        changeTab={changeTab}
        listModeOnly={listModeOnly}
        setListModeOnly={setListModeOnly}
        setLocalTalents={setLocalTalents}
        setSelectedSort={setSelectedSort}
        setSortDirection={setSortDirection}
      />
      {localTalents.length === 0 && (
        <div className="d-flex justify-content-center mt-6">
          <P2
            className="text-black"
            bold
            text="We couldn’t find any talent based on your search."
          />
        </div>
      )}
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
        />
      ) : (
        <TalentTableCardMode
          talents={filteredTalents}
          getMarketCap={getMarketCap}
          getSupporterCount={getSupporterCount}
          updateFollow={updateFollow}
        />
      )}
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <ApolloProvider client={client(railsContext.contractsEnv)}>
        <TalentPage {...props} />
      </ApolloProvider>
    </ThemeContainer>
  );
};

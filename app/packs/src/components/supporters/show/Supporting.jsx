import React, { useEffect, useMemo, useState, useContext } from "react";
import { ethers } from "ethers";
import dayjs from "dayjs";

import {
  ApolloProvider,
  useQuery,
  GET_SUPPORTER_PORTFOLIO,
  client,
  PAGE_SIZE,
} from "src/utils/thegraph";
import {
  getSupporterCount,
  getMarketCap,
  getProgress,
  getMarketCapVariance,
  getStartDateForVariance,
  getUTCDate
} from "src/utils/viewHelpers";
import {
  compareStrings,
  compareNumbers,
  compareDates,
} from "src/utils/compareHelpers";
import { get, post, destroy } from "src/utils/requests";
import { camelCaseObject } from "src/utils/transformObjects";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import { H5, P2 } from "src/components/design_system/typography";
import { Spinner } from "src/components/icons";
import TalentTableListMode from "src/components/talent/TalentTableListMode";
import TalentTableCardMode from "src/components/talent/TalentTableCardMode";
import SupportingOptions from "./SupportingOptions";

const concatenateTokenAddresses = (tokens) =>
  `?tokens[]=${tokens.map((t) => t.talent.id).join("&tokens[]=")}`;

const Supporting = ({
  wallet,
  setSupportingCount,
  publicPageViewer,
  withOptions = true,
  listMode = false,
}) => {
  const urlParams = new URLSearchParams(document.location.search);
  const theme = useContext(ThemeContext);

  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [listModeOnly, setListModeOnly] = useState(listMode);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [nameSearch, setNameSearch] = useState(urlParams.get("name") || "");
  const [localLoading, setLocalLoading] = useState(true);
  const [localTalents, setLocalTalents] = useState([]);
  const [page, setPage] = useState(0);
  const [listLoaded, setListLoaded] = useState(false);

  const startDate = getStartDateForVariance();
  const { loading, data } = useQuery(GET_SUPPORTER_PORTFOLIO, {
    variables: {
      id: wallet?.toLowerCase(),
      skip: page * PAGE_SIZE,
      first: PAGE_SIZE,
      startDate,
    },
    skip: listLoaded,
  });

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

  const compareOccupation = (talent1, talent2) =>
    compareStrings(talent1.occupation, talent2.occupation);

  const compareSupporters = (talent1, talent2) =>
    compareStrings(talent1.supporterCounter, talent2.supporterCounter);

  const compareMarketCap = (talent1, talent2) => {
    const talent1Amount = ethers.utils.parseUnits(
      getMarketCap(talent1.totalSupply)?.replaceAll(",", "") || "0"
    );
    const talent2Amount = ethers.utils.parseUnits(
      getMarketCap(talent2.totalSupply)?.replaceAll(",", "") || "0"
    );

    compareNumbers(talent1Amount, talent2Amount);
  };

  const compareDate = (talent1, talent2) =>
    compareDates(talent1.lastTimeBoughtAt, talent2.lastTimeBoughtAt);

  const filteredTalents = useMemo(() => {
    let desiredTalent = [...localTalents];
    if (watchlistOnly) {
      desiredTalent = localTalents.filter((talent) => talent.isFollowing);
    }
    if (nameSearch) {
      desiredTalent = desiredTalent.filter((talent) => {
        if (talent.loaded) {
          return (
            talent.user.displayName
              .toLowerCase()
              .includes(nameSearch.toLowerCase()) ||
            talent.user.username
              .toLowerCase()
              .includes(nameSearch.toLowerCase()) ||
            talent.token.ticker.toLowerCase().includes(nameSearch.toLowerCase())
          );
        }
      });
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
      case "First Buy":
        comparisonFunction = compareDate;
        break;
    }

    if (sortDirection === "asc") {
      desiredTalent.sort(comparisonFunction).reverse();
    } else if (sortDirection === "desc") {
      desiredTalent.sort(comparisonFunction);
    }

    return desiredTalent.filter((t) => t.hasInfo);
  }, [localTalents, watchlistOnly, selectedSort, sortDirection, nameSearch]);

  const populateTalent = async (talentsWithNoInfo) => {
    if (talentsWithNoInfo.length == 0) {
      return;
    }

    const newLocalTalents = [...localTalents];

    const response = await get(
      `/api/v1/public_talent${concatenateTokenAddresses(talentsWithNoInfo)}`
    );

    if (response.length > 0) {
      response.forEach((element) => {
        const index = localTalents.findIndex(
          (localTalent) => localTalent.talent.id === element.token.contract_id
        );

        if (index > -1) {
          newLocalTalents[index] = {
            ...newLocalTalents[index],
            ...camelCaseObject(element),
            hasInfo: true,
          };
        } else {
          newLocalTalents.push({ ...camelCaseObject(element), hasInfo: true });
        }
      });
    }

    setLocalTalents(newLocalTalents.map((t) => ({ ...t, loaded: true })));
  };

  useEffect(() => {
    const talentsWithNoInfo = localTalents.filter((item) => !item.loaded);

    populateTalent(talentsWithNoInfo);
  }, [localTalents]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  useEffect(() => {
    if (loading || !data?.supporter) {
      if (!loading) {
        setLocalLoading(false);
      }
      return;
    }

    if (localLoading) {
      setLocalLoading(false);
    }

    const newTalents = data.supporter.talents.map(
      ({ firstTimeBoughtAt, talent, ...rest }) => {
        let deployDateUTC;
        if (!!talent.createdAtTimestamp) {
          const msDividend = 1000;
          deployDateUTC = getUTCDate(
            parseInt(talent.createdAtTimestamp) * msDividend
          );
        } else {
          const localTalent = localTalents.find(
            (talent) => talent.token.contractId == talent.id
          );
          deployDateUTC =
            localTalent && getUTCDate(localTalent.token.deployedAt);
        }
        return {
          ...rest,
          progress: getProgress(talent.totalSupply, talent.maxSupply),
          marketCap: getMarketCap(talent.totalSupply),
          supporterCounter: getSupporterCount(talent.supporterCounter),
          firstTimeBoughtAt: dayjs
            .unix(firstTimeBoughtAt)
            .format("DD MMM, YYYY"),
          marketCapVariance: getMarketCapVariance(
            talent.tokenDayData || [],
            deployDateUTC || 0,
            startDate,
            talent.totalSupply
          ),
          talent,
        };
      }
    );

    setLocalTalents((prev) => [...prev, ...newTalents]);

    if (data.supporter.talents.length == PAGE_SIZE) {
      loadMore();
    } else {
      setListLoaded(true);
    }
  }, [data, loading]);

  useEffect(() => {
    if (setSupportingCount && localTalents.length > 0) {
      setSupportingCount(localTalents.length);
    }
  }, [setSupportingCount, localTalents.length]);


  const supportingTalent = () => (
    <>
      {localTalents.length > 0 && (
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
              updateFollow={updateFollow}
              publicPageViewer={publicPageViewer}
            />
          )}
        </>
      )}
    </>
  );

  const notSupportingTalent = () => (
    <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
      <H5 text="This user doesn't support any Talent yet" bold />
      <P2 text="All supported talents will be listed here" bold />
    </div>
  );

  if (localLoading) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <Spinner />
      </div>
    );
  }

  return (
    <>{localTalents.length > 0 ? supportingTalent() : notSupportingTalent()}</>
  );
};

export default (props) => (
  <ThemeContainer {...props}>
    <ApolloProvider client={client(props.railsContext.contractsEnv)}>
      <Supporting {...props} />
    </ApolloProvider>
  </ThemeContainer>
);

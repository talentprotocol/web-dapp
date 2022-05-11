import React, { useEffect, useState, useContext, useMemo } from "react";
import { ethers } from "ethers";

import { useWindowDimensionsHook } from "src/utils/window";

import { getMarketCap, getProgress } from "src/utils/viewHelpers";
import { compareStrings, compareNumbers } from "src/utils/compareHelpers";
import { post, destroy } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import { H3, P1, P2 } from "src/components/design_system/typography";
import TalentTableListMode from "./TalentTableListMode";
import TalentTableCardMode from "./TalentTableCardMode";
import TalentOptions from "./TalentOptions";

import cx from "classnames";

const TalentPage = ({ talents, env }) => {
  const theme = useContext(ThemeContext);
  const { mobile } = useWindowDimensionsHook();
  const [localTalents, setLocalTalents] = useState(talents);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [listModeOnly, setListModeOnly] = useState(false);
  const [selectedSort, setSelectedSort] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

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

  const compareName = (talent1, talent2) =>
    compareStrings(talent1.user.name, talent2.user.name);

  const compareOccupation = (talent1, talent2) =>
    compareStrings(talent1.occupation, talent2.occupation);

  const compareSupporters = (talent1, talent2) =>
    compareNumbers(talent1.supporterCounter, talent2.supporterCounter);

  const compareMarketCap = (talent1, talent2) => {
    const talent1Amount = ethers.utils.parseUnits(
      talent1.marketCap?.replaceAll(",", "") || "0"
    );
    const talent2Amount = ethers.utils.parseUnits(
      talent2.marketCap?.replaceAll(",", "") || "0"
    );

    return compareNumbers(talent1Amount, talent2Amount);
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
  }, [localTalents, watchlistOnly, selectedSort, sortDirection]);

  useEffect(() => {
    const newTalents = talents.map((talent) => ({
      ...talent,
      marketCap: getMarketCap(talent.totalSupply),
      progress: getProgress(
        talent.totalSupply || "0",
        talent.maxSupply,
        talent.id
      ),
    }));

    setLocalTalents(newTalents);
  }, [talents]);

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
          updateFollow={updateFollow}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          showFirstBoughtField={false}
        />
      ) : (
        <TalentTableCardMode
          talents={filteredTalents}
          updateFollow={updateFollow}
          env={env}
        />
      )}
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <TalentPage {...props} env={railsContext.contractsEnv} />
    </ThemeContainer>
  );
};

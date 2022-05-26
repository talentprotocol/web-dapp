import React, { useState, useEffect } from "react";
import { get } from "src/utils/requests";

import Button from "src/components/design_system/button";
import TabButton from "src/components/design_system/tab/TabButton.jsx";
import TalentKeywordSearch from "./TalentKeywordSearch";
import TalentFilters from "./TalentFilters";
import { Grid, List } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";
import { camelCaseObject } from "src/utils/transformObjects";
import { P1 } from "src/components/design_system/typography";

import cx from "classnames";

const TalentOptions = ({
  changeTab,
  searchUrl,
  listModeOnly,
  headerDescription,
  setListModeOnly,
  setLocalTalents,
  setSelectedSort,
  setSortDirection,
}) => {
  const { mobile } = useWindowDimensionsHook();
  const url = new URL(document.location);
  const [keyword, setKeyword] = useState(url.searchParams.get("keyword") || "");
  const [status, setStatus] = useState(url.searchParams.get("status") || "All");

  const filter = (e, filterType, option) => {
    e.preventDefault();

    const params = new URLSearchParams(document.location.search);
    params.set(filterType, option);

    get(`${searchUrl}?${params.toString()}`).then((response) => {
      const talents = response.map((talent) => camelCaseObject(talent));

      if (option === "Trending") {
        setSelectedSort("Market Cap");
        setSortDirection("asc");
      } else {
        setSelectedSort("");
      }
      setLocalTalents(talents);
      window.history.replaceState(
        {},
        document.title,
        `${url.pathname}?${params.toString()}`
      );
    });
  };

  useEffect(() => {
    if (status === "Trending") {
      setSelectedSort("Market Cap");
    }
  }, [status]);

  return (
    <div
      className="my-6 d-flex flex-wrap justify-content-between align-items-center"
      style={{ height: mobile ? "" : 34 }}
    >
      {headerDescription ? (
        <P1 bold className="text-black" text={headerDescription} />
      ) : (
        <TabButton
          textTabPrimary="All Talent"
          textTabSecondary="Watchlist"
          onClick={(tab) => changeTab(tab)}
        />
      )}
      <div className={cx("d-flex ml-auto", mobile && "mt-3")}>
        <TalentKeywordSearch
          keyword={keyword}
          setKeyword={setKeyword}
          filter={filter}
        />
        <div className="ml-2">
          <TalentFilters
            status={status}
            setStatus={setStatus}
            filter={filter}
          />
        </div>
        <Button
          className="ml-2 text-black d-flex align-items-center justify-content-center"
          size="icon"
          type="white-subtle"
          onClick={() => setListModeOnly(false)}
        >
          <Grid
            fill={listModeOnly ? "currentColor" : "#7a55ff"}
            color="inherit"
          />
        </Button>
        <Button
          className="ml-2 d-flex align-items-center justify-content-center"
          size="icon"
          type="white-subtle"
          onClick={() => setListModeOnly(true)}
        >
          <List
            fill={!listModeOnly ? "currentColor" : "#7a55ff"}
            color="inherit"
          />
        </Button>
      </div>
    </div>
  );
};

export default TalentOptions;

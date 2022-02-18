import React, { useEffect, useState } from "react";
import { get } from "src/utils/requests";

import Button from "src/components/design_system/button";
import TabButton from "src/components/design_system/tab/TabButton.jsx";
import TalentNameSearch from "./TalentNameSearch";
import TalentFilters from "./TalentFilters";
import { Grid, List } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";

import cx from "classnames";

const TalentOptions = ({
  changeTab,
  listModeOnly,
  setListModeOnly,
  setLocalTalents,
  compareCirculatingSupply,
}) => {
  const { mobile } = useWindowDimensionsHook();
  const url = new URL(document.location);
  const [name, setName] = useState(url.searchParams.get("name") || "");
  const [status, setStatus] = useState(url.searchParams.get("status") || "All");

  const filter = (e, filterType, option) => {
    e.preventDefault();

    const params = new URLSearchParams(document.location.search);
    params.set(filterType, option);

    get(`/api/v1/talent?${params.toString()}`).then((response) => {
      if (option === "Trending") {
        setLocalTalents(
          response.talents.sort(compareCirculatingSupply).reverse()
        );
      } else {
        setLocalTalents(response.talents);
      }
      window.history.replaceState(
        {},
        document.title,
        `${url.pathname}?${params.toString()}`
      );
    });
  };

  return (
    <div
      className="mt-5 mb-6 d-flex flex-wrap justify-content-between"
      style={{ height: mobile ? "" : 34 }}
    >
      <TabButton
        textTabPrimary="All Talent"
        textTabSecondary="Watchlist"
        onClick={(tab) => changeTab(tab)}
      />
      <div className={cx("d-flex", mobile && "mt-3")}>
        <TalentNameSearch name={name} setName={setName} filter={filter} />
        <div className="ml-2">
          <TalentFilters
            status={status}
            setStatus={setStatus}
            filter={filter}
          />
        </div>
        <Button
          className="ml-2 text-black"
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
          className="ml-2"
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

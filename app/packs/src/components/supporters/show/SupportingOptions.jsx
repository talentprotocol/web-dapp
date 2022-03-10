import React, { useState } from "react";

import Button from "src/components/design_system/button";
import TabButton from "src/components/design_system/tab/TabButton.jsx";
import TalentNameSearch from "src/components/talent/TalentNameSearch";
import { Grid, List } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";

import cx from "classnames";

const SupportingOptions = ({
  changeTab,
  listModeOnly,
  setListModeOnly,
  setNameSearch,
  publicPageViewer,
}) => {
  const { mobile } = useWindowDimensionsHook();
  const url = new URL(document.location);
  const [name, setName] = useState(url.searchParams.get("name") || "");

  const filter = (e, filterType, option) => {
    e.preventDefault();

    const params = new URLSearchParams(document.location.search);
    params.set(filterType, option);

    window.history.pushState(
      {},
      document.title,
      `${url.pathname}?${params.toString()}`
    );
    setNameSearch(option);
  };

  return (
    <div
      className="d-flex flex-wrap justify-content-between"
      style={{ height: mobile ? "" : 34 }}
    >
      {!publicPageViewer && (
        <TabButton
          textTabPrimary="All Talent"
          textTabSecondary="Watchlist"
          onClick={(tab) => changeTab(tab)}
        />
      )}
      <div className={cx("d-flex", mobile && "mt-3")}>
        <TalentNameSearch
          className="ml-2"
          name={name}
          setName={setName}
          filter={filter}
        />
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

export default SupportingOptions;

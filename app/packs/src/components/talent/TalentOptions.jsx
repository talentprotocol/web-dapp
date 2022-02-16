import React from "react";
import Button from "src/components/design_system/button";
import TabButton from "src/components/design_system/tab/TabButton.jsx";
import TalentNameSearch from "./TalentNameSearch";
import { Grid, List } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";

import cx from "classnames";

const TalentOptions = ({
  changeTab,
  listModeOnly,
  setListModeOnly,
  setLocalTalents,
}) => {
  const { mobile } = useWindowDimensionsHook();

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
        <TalentNameSearch setLocalTalents={setLocalTalents} />
        <Button
          className="ml-2"
          size="icon"
          type="white-subtle"
          onClick={() => setListModeOnly(false)}
        >
          <Grid fill={listModeOnly ? "#fff" : "#7a55ff"} color="inherit" />
        </Button>
        <Button
          className="ml-2"
          size="icon"
          type="white-subtle"
          onClick={() => setListModeOnly(true)}
        >
          <List fill={!listModeOnly ? "#fff" : "#7a55ff"} color="inherit" />
        </Button>
      </div>
    </div>
  );
};

export default TalentOptions;

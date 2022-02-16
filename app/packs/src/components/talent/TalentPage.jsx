import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { useWindowDimensionsHook } from "src/utils/window";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  client,
} from "src/utils/thegraph";
import { post, destroy } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import { H3, P1 } from "src/components/design_system/typography";
import TalentTableListMode from "./TalentTableListMode";
import TalentTableCardMode from "./TalentTableCardMode";
import TalentOptions from "./TalentOptions";

import cx from "classnames";

const TalentPage = ({ talents }) => {
  const theme = useContext(ThemeContext);
  const { mobile } = useWindowDimensionsHook();
  const { loading, data } = useQuery(GET_TALENT_PORTFOLIO, {
    variables: { ids: talents.map((talent) => talent.contractId) },
  });
  const [localTalents, setLocalTalents] = useState(talents);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [listModeOnly, setListModeOnly] = useState(false);

  const getSupporterCount = (contractId) => {
    if (loading || !data) {
      return "0";
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contractId.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(chosenTalent.supporterCounter);
    }
    return "0";
  };

  const getCirculatingSupply = (contractId) => {
    if (loading || !data) {
      return "0";
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contractId.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(
        ethers.utils.formatUnits(chosenTalent.totalSupply)
      );
    }
    return "0";
  };

  const getProgress = (contractId) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contractId.toLowerCase()
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

  return (
    <div className={cx(mobile && "m-4")}>
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
      />
      {listModeOnly ? (
        <TalentTableListMode
          theme={theme}
          talents={localTalents}
          getProgress={getProgress}
          getCirculatingSupply={getCirculatingSupply}
          getSupporterCount={getSupporterCount}
          updateFollow={updateFollow}
          watchlistOnly={watchlistOnly}
        />
      ) : (
        <TalentTableCardMode
          talents={localTalents}
          getCirculatingSupply={getCirculatingSupply}
          getSupporterCount={getSupporterCount}
          updateFollow={updateFollow}
          watchlistOnly={watchlistOnly}
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

import React, { useState, useContext, useMemo } from "react";
import { useWindowDimensionsHook } from "../../utils/window";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ethers } from "ethers";
import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  client,
} from "src/utils/thegraph";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import TalentCard from "src/components/design_system/cards/talent";
import Button from "src/components/design_system/button";

const ActiveTalents = ({ talents }) => {
  const [start, setStart] = useState(0);
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO);
  const { height, width } = useWindowDimensionsHook();
  const theme = useContext(ThemeContext);
  const [mobile, setMobile] = useState(false);

  const itemsPerRow = useMemo(() => {
    if (width < 992) {
      setMobile(true);
      return talents.length;
    } else {
      setMobile(false);
    }

    const sidebar = 220;
    const card = 290;

    const numberOfCards = (width - sidebar) / card;
    return Math.floor(numberOfCards);
  }, [width]);

  const end =
    talents.length > itemsPerRow ? start + itemsPerRow : talents.length;

  const sliceInDisplay = talents.slice(start, end);

  const slideLeft = () => {
    if (start - itemsPerRow < 0) {
      setStart(0);
    } else {
      setStart((prev) => prev - itemsPerRow);
    }
  };
  const slideRight = () => {
    if (start + itemsPerRow >= talents.length) {
      setStart(talents.length - 1);
    } else {
      setStart((prev) => prev + itemsPerRow);
    }
  };
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= talents.length;

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

  if (talents.length === 0) {
    return <></>;
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4 px-3">
        <div className="d-flex flex-row align-items-center">
          <h6 className="mb-0">
            <strong>New Talent</strong>
          </h6>
        </div>
        {talents.length > itemsPerRow && (
          <div className="d-flex flex-row">
            <Button
              onClick={slideLeft}
              disabled={disableLeft}
              type="white-subtle"
              mode={theme.mode()}
              className="mr-2"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            </Button>
            <Button
              onClick={slideRight}
              disabled={disableRight}
              type="white-subtle"
              mode={theme.mode()}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </Button>
          </div>
        )}
      </div>
      <div className="d-flex flex-row mb-2 mt-3 px-3 horizontal-scroll hide-scrollbar">
        {sliceInDisplay.map((talent, index) => (
          <TalentCard
            mobile={mobile}
            mode={theme.mode()}
            photo_url={talent.profilePictureUrl}
            name={talent.name}
            title={talent.occupation}
            circ_supply={getCirculatingSupply(talent.contract_id)}
            ticker={talent.ticker}
            key={`active_talent_list_${talent.id}_${index}`}
            href={`/talent/${talent.username}`}
          />
        ))}
      </div>
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <ApolloProvider client={client(railsContext.contractsEnv)}>
        <ActiveTalents {...props} />
      </ApolloProvider>
    </ThemeContainer>
  );
};

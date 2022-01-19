import React, { useState, useMemo, useContext } from "react";
import { useWindowDimensionsHook } from "../../utils/window";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import TalentCard from "src/components/design_system/cards/talent";
import Button from "src/components/design_system/button";

const UpcomingTalents = ({ talents }) => {
  const [start, setStart] = useState(0);
  const { height, width } = useWindowDimensionsHook();
  const [mobile, setMobile] = useState(0);
  const theme = useContext(ThemeContext);

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

  if (talents.length === 0) {
    return <></>;
  }

  return (
    <div className={mobile && "pl-4"}>
      <div className="d-flex flex-row justify-content-between align-items-center">
        <div className="d-flex flex-row align-items-center">
          <h6 className="mb-0">
            <strong>Upcoming Talent</strong>
          </h6>
        </div>
        {talents.length > itemsPerRow && (
          <div className="d-flex flex-row">
            <Button
              onClick={slideLeft}
              disabled={disableLeft}
              type="white-ghost"
              mode={theme.mode()}
              className="mr-2"
            >
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            </Button>
            <Button
              onClick={slideRight}
              disabled={disableRight}
              type="white-ghost"
              mode={theme.mode()}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </Button>
          </div>
        )}
      </div>
      <div className="d-flex flex-row mb-5 mt-3 horizontal-scroll hide-scrollbar">
        {sliceInDisplay.map((talent, index) => (
          <TalentCard
            coming_soon={true}
            mobile={mobile}
            mode={theme.mode()}
            photo_url={talent.profilePictureUrl}
            name={talent.name}
            title={talent.occupation}
            key={`upcoming_talent_list_${talent.id}_${index}`}
            href={`/talent/${talent.username}`}
          />
        ))}
      </div>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <UpcomingTalents {...props} />
    </ThemeContainer>
  );
};

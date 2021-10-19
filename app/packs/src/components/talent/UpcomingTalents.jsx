import React, { useState, useMemo } from "react";
import { useWindowDimensionsHook } from "../../utils/window";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TalentProfilePicture from "./TalentProfilePicture";

const UpcomingTalents = ({ talents }) => {
  const [start, setStart] = useState(0);
  const { height, width } = useWindowDimensionsHook();

  const itemsPerRow = useMemo(() => {
    if (width > 1200) {
      return 4;
    } else if (width > 768) {
      return 3;
    } else {
      return 1;
    }
  }, [width]);

  const colStyling = useMemo(() => {
    if (itemsPerRow === 4) {
      return "col-3";
    } else if (itemsPerRow === 3) {
      return "col-4";
    } else {
      return "col-12 mx-auto";
    }
  }, [itemsPerRow]);

  const end =
    talents.length > itemsPerRow ? start + itemsPerRow : talents.length;

  const sliceInDisplay = talents.slice(start, end);

  const slideLeft = () => setStart((prev) => prev - 1);
  const slideRight = () => setStart((prev) => prev + 1);
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= talents.length;

  if (talents.length === 0) {
    return <></>;
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <div className="d-flex flex-row align-items-center">
          <h5 className="mb-0">
            <strong>Upcoming Talent</strong>
          </h5>
        </div>
        <div className="d-flex flex-row">
          <button
            className="btn btn-light"
            onClick={slideLeft}
            disabled={disableLeft}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </button>
          <button
            className="btn btn-light ml-2"
            onClick={slideRight}
            disabled={disableRight}
          >
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </button>
        </div>
      </div>
      <div className="d-flex flex-row flex-wrap mb-2 mt-3">
        {sliceInDisplay.map((talent) => (
          <div
            className={`mt-3 mh-100 ${colStyling}`}
            key={`upcoming_talent_list_${talent.id}`}
          >
            <a
              className={`h-100 bg-light rounded d-flex flex-column p-3 talent-link`}
              href={`/talent/${talent.username}`}
            >
              <TalentProfilePicture
                src={talent.profilePictureUrl}
                height={"100%"}
                straight
                className={"rounded mx-auto"}
              />
              <h5 className="mt-3 talent-link">{talent.name}</h5>
              <h6 className="text-muted talent-link">{talent.occupation}</h6>
              <div className="mt-2 talent-link">
                <small className="p-2 text-primary bg-info rounded talent-link">
                  Coming Soon
                </small>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};

export default UpcomingTalents;

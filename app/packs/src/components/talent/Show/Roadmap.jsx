import React, { useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import RoadmapCard from "src/components/design_system/cards/roadmap";
import P1 from "src/components/design_system/typography/p1";
import Button from "src/components/design_system/button";

const Roadmap = ({ goals, width, mode, mobile }) => {
  const [start, setStart] = useState(0);
  const itemsPerRow = width < 768 ? 1 : 2;

  const end = goals.length > itemsPerRow ? start + itemsPerRow : goals.length;
  const sliceInDisplay = goals.slice(start, end);

  const slideLeft = () => {
    if (start - itemsPerRow < 0) {
      setStart(0);
    } else {
      setStart((prev) => prev - itemsPerRow);
    }
  };
  const slideRight = () => {
    if (start + itemsPerRow >= goals.length) {
      setStart(goals.length - 1);
    } else {
      setStart((prev) => prev + itemsPerRow);
    }
  };

  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= goals.length;

  const margins = (index) => {
    if (sliceInDisplay.length < itemsPerRow) {
      return "mr-3";
    }

    if (index === 0) {
      return "mr-auto";
    } else if (index === itemsPerRow - 1) {
      return "ml-auto";
    }

    return "mx-auto";
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <P1 mode={mode} text="Roadmap" bold className="mb-3 text-black" />
        {goals.length > itemsPerRow && (
          <div className="d-flex flex-row">
            <Button
              type="white-subtle"
              onClick={slideLeft}
              disabled={disableLeft}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            </Button>
            <Button
              type="white-subtle"
              className="ml-2"
              onClick={slideRight}
              disabled={disableRight}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </Button>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-start mb-2 mt-3">
        {sliceInDisplay.map((goal, index) => (
          <RoadmapCard
            key={`goal_list_${goal.id}`}
            className={`${margins(index)} ${
              itemsPerRow == 1 ? "col-12" : "w-49"
            } ${mobile ? "remove-background p-0" : ""}`}
            mode={mode}
            due_date={goal.due_date}
            title={goal.title}
            description={goal.description}
          />
        ))}
      </div>
    </>
  );
};

export default Roadmap;

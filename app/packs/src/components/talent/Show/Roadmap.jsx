import React, { useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Roadmap = ({ goals, width }) => {
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
        <h5>
          <strong>Roadmap</strong>
        </h5>
        {goals.length > itemsPerRow && (
          <div className="d-flex flex-row">
            <button
              className="btn btn-secondary"
              onClick={slideLeft}
              disabled={disableLeft}
            >
              <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            </button>
            <button
              className="btn btn-secondary ml-2"
              onClick={slideRight}
              disabled={disableRight}
            >
              <FontAwesomeIcon icon={faChevronRight} size="sm" />
            </button>
          </div>
        )}
      </div>
      <div className="d-flex justify-content-start mb-2 mt-3">
        {sliceInDisplay.map((goal, index) => (
          <div
            key={`goal_list_${goal.id}`}
            className={`bg-light rounded p-3 ${margins(index)} ${
              itemsPerRow == 1 ? "col-12" : "w-49"
            }`}
          >
            <small>
              <strong>{goal.due_date}</strong>
            </small>
            <h5>{goal.title}</h5>
            <p>{goal.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Roadmap;

import React, { useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Roadmap = ({ goals }) => {
  const [start, setStart] = useState(0);
  const itemsPerRow = 2;

  const end = goals.length > itemsPerRow ? start + itemsPerRow : goals.length;
  const sliceInDisplay = goals.slice(start, end);

  const slideLeft = () => setStart((prev) => prev - 1);
  const slideRight = () => setStart((prev) => prev + 1);
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= goals.length;

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <h5>
          <strong>Roadmap</strong>
        </h5>
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
      </div>
      <div className="d-flex flex-row mb-2 mt-3">
        {sliceInDisplay.map((goal, index) => (
          <div
            key={`goal_list_${goal.id}`}
            className={`${index == 0 && "mr-2"} bg-light rounded p-2 w-100`}
          >
            <small>
              <strong>{goal.due_date}</strong>
            </small>
            <p>{goal.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Roadmap;

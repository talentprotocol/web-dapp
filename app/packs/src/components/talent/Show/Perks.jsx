import React, { useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Perks = ({ perks, ticker, width }) => {
  const [start, setStart] = useState(0);
  const itemsPerRow = width < 768 ? 1 : 3;

  const end = perks.length > itemsPerRow ? start + itemsPerRow : perks.length;
  const sliceInDisplay = perks.slice(start, end);

  const slideLeft = () => setStart((prev) => prev - 1);
  const slideRight = () => setStart((prev) => prev + 1);
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= perks.length;

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <h5>
          <strong>Perks</strong>
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
      <div className="d-flex flex-row mt-3 mb-2">
        {sliceInDisplay.map((perk, index) => (
          <div
            key={`perk_list_${perk.id}`}
            className={`${index == 0 && "mr-2"} bg-light rounded p-2 col-${
              itemsPerRow == 1 ? 12 : 4
            } d-flex flex-column`}
          >
            <p>{perk.title}</p>
            <small className="text-warning">
              <strong>
                HOLD {perk.price} {ticker}
              </strong>
            </small>
          </div>
        ))}
      </div>
    </>
  );
};

export default Perks;

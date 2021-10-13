import React, { useState, useEffect, useCallback, useMemo } from "react";
import { OnChain } from "src/onchain";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Perks = ({ perks, ticker, width, contract }) => {
  const [start, setStart] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const itemsPerRow = width < 768 ? 1 : 3;

  const end = perks.length > itemsPerRow ? start + itemsPerRow : perks.length;

  const sortedPerks = useMemo(() => {
    return perks.sort((first, second) => {
      if (first.price > second.price) {
        return 1;
      } else if (first.price < second.price) {
        return -1;
      }
      return 0;
    });
  }, [perks]);

  const sliceInDisplay = sortedPerks.slice(start, end);

  const slideLeft = () => setStart((prev) => prev - 1);
  const slideRight = () => setStart((prev) => prev + 1);
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= perks.length;

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain();
    const result = await newOnChain.initialize();

    if (!result) {
      return;
    }

    if (contract) {
      const _token = newOnChain.getToken(contract);
      const balance = await _token.balanceOf(newOnChain.account);
      setAvailableBalance(balance);
    }
  }, []);

  useEffect(() => {
    setupOnChain();
  }, []);

  const calculateAmount = (price) => {
    if (price < availableBalance) {
      return 0;
    } else {
      return price - availableBalance;
    }
  };

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
      <div className="d-flex justify-content-start mt-3 mb-2">
        {sliceInDisplay.map((perk, index) => (
          <div
            key={`perk_list_${perk.id}`}
            className={`bg-light rounded p-3 d-flex flex-column justify-content-between ${margins(
              index
            )} ${itemsPerRow == 1 ? "col-12" : "w-32"}`}
          >
            <p>{perk.title}</p>
            <small className="text-warning">
              {calculateAmount(perk.price) === 0 && <strong>AVAILABLE</strong>}
              {calculateAmount(perk.price) > 0 && (
                <strong>
                  HOLD +{calculateAmount(perk.price)} {ticker}
                </strong>
              )}
            </small>
          </div>
        ))}
      </div>
    </>
  );
};

export default Perks;

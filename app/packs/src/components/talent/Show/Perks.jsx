import React, { useState, useEffect, useCallback, useMemo } from "react";
import { OnChain } from "src/onchain";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ethers } from "ethers";

import Perk from "src/components/design_system/cards/perk";
import P1 from "src/components/design_system/typography/p1";

const Perks = ({
  perks,
  ticker,
  width,
  contract,
  talentUserId,
  hideAction,
  railsContext,
  mode,
}) => {
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

  const slideLeft = () => {
    if (start - itemsPerRow < 0) {
      setStart(0);
    } else {
      setStart((prev) => prev - itemsPerRow);
    }
  };
  const slideRight = () => {
    if (start + itemsPerRow >= sortedPerks.length) {
      setStart(sortedPerks.length - 1);
    } else {
      setStart((prev) => prev + itemsPerRow);
    }
  };

  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= perks.length;

  const setupOnChain = useCallback(async () => {
    const newOnChain = new OnChain(railsContext.contractsEnv);
    const result = await newOnChain.connectedAccount();

    if (!result) {
      return;
    }

    if (contract) {
      const _token = await newOnChain.getToken(contract);
      if (_token) {
        const balance = await _token.balanceOf(newOnChain.account);
        setAvailableBalance(balance);
      }
    }
  }, []);

  useEffect(() => {
    setupOnChain();
  }, []);

  const calculateAmount = (price) => {
    const bnPrice = ethers.BigNumber.from(
      ethers.utils.parseEther(price.toString())
    );

    if (bnPrice.lt(availableBalance)) {
      return 0;
    } else {
      const newValue = bnPrice.sub(availableBalance);
      if (newValue.eq(0)) {
        return 0;
      } else {
        return ethers.utils.formatUnits(newValue);
      }
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
        <P1 mode={mode} text="Perks" bold className="mb-3" />
        {sortedPerks.length > itemsPerRow && (
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
      <div className="d-flex justify-content-start mt-3 mb-2">
        {sliceInDisplay.map((perk, index) => (
          <Perk
            key={`perk_list_${perk.id}`}
            mode={mode}
            area={"General"}
            title={perk.title}
            my_tokens={parseFloat(availableBalance)}
            tokens={parseFloat(perk.price)}
            ticker={ticker}
            href={`/messages?user=${talentUserId}&perk=${perk.id}`}
            hideAction={hideAction}
            className={`${margins(index)} ${
              itemsPerRow == 1 ? "col-12" : "w-32"
            }`}
          />
        ))}
      </div>
    </>
  );
};

export default Perks;

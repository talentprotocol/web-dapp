import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useWindowDimensionsHook } from "../../utils/window";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ethers } from "ethers";
import { OnChain } from "src/onchain";

import TalentProfilePicture from "./TalentProfilePicture";

const ActiveTalents = ({ talents }) => {
  const [start, setStart] = useState(0);
  const [chainAPI, setChainAPI] = useState(null);
  const [displaySupplies, setDisplaySupplies] = useState({});
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

  const setupChain = useCallback(async () => {
    const newOnChain = new OnChain();
    await newOnChain.initialize();

    if (newOnChain) {
      setChainAPI(newOnChain);
    }
  });

  useEffect(() => {
    setupChain();
  }, []);

  useEffect(() => {
    if (!chainAPI) {
      return;
    }

    sliceInDisplay.forEach((talent) => {
      const token = chainAPI.getToken(talent.contract_id);

      token.totalSupply().then((result) =>
        setDisplaySupplies((prev) => ({
          ...prev,
          [talent.contract_id]: ethers.utils.commify(
            ethers.utils.formatUnits(result)
          ),
        }))
      );
    });
  }, [chainAPI, sliceInDisplay]);

  if (talents.length === 0) {
    return <></>;
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <div className="d-flex flex-row align-items-center">
          <h5 className="mb-0">
            <strong>Top Talent</strong>
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
      <div className="container-fluid mb-2 mt-3">
        <div className="row">
          {sliceInDisplay.map((talent, index) => (
            <div
              key={`active_talent_list${talent.id}`}
              className={`mt-3 ${colStyling}`}
              style={{ paddingRight: 10, paddingLeft: 10 }}
            >
              <a
                className={`h-100 bg-light rounded d-flex flex-column p-3 talent-link`}
                href={`/talent/${talent.username}`}
              >
                <TalentProfilePicture
                  src={talent.profilePictureUrl}
                  height={220}
                  straight
                  className={"rounded mx-auto"}
                />
                <h5 className="mt-3 talent-link">{talent.name}</h5>
                <h6 className="text-muted talent-link">{talent.occupation}</h6>
                <small className="text-muted mt-3 talent-link">
                  CIRCULATING SUPPLY
                </small>
                <small className="text-warning mt-2 talent-link">
                  <strong className="text-black mr-2">
                    {displaySupplies[talent.contract_id] || 0}
                  </strong>{" "}
                  {talent.ticker}
                </small>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ActiveTalents;

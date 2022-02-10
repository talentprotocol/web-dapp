import React, { useState, useEffect } from "react";
import { string, bool, number, arrayOf, shape } from "prop-types";
import { ethers } from "ethers";
import currency from "currency.js";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Link from "src/components/design_system/link";
import Tag from "src/components/design_system/tag";
import Divider from "src/components/design_system/other/Divider";
import { P1, P2, P3 } from "src/components/design_system/typography";
import { ArrowForward } from "src/components/icons";
import { useWindowDimensionsHook } from "src/utils/window";
import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
  client,
} from "src/utils/thegraph";

import cx from "classnames";

const HighlightsCard = ({ title, talents, className }) => {
  const { mobile } = useWindowDimensionsHook();
  const [localTalents, setLocalTalents] = useState(talents);
  const { loadingIndex0, data: talentIndex0Data } = useQuery(
    GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
    {
      variables: { id: localTalents[0]?.contractId?.toLowerCase() },
    }
  );
  const { loadingIndex1, data: talentIndex1Data } = useQuery(
    GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
    {
      variables: { id: localTalents[1]?.contractId?.toLowerCase() },
    }
  );
  const { loadingIndex2, data: talentIndex2Data } = useQuery(
    GET_TALENT_PORTFOLIO_FOR_ID_SIMPLE,
    {
      variables: { id: localTalents[2]?.contractId?.toLowerCase() },
    }
  );

  const icon = () => {
    switch (title) {
      case "Most Trendy":
        return "🔥";
      case "Latest Added":
        return "🚀";
      case "Launching Soon":
        return "💎";
      default:
        return "";
    }
  };

  const addTokenDetails = (talents, totalSupply, index) => {
    const newArray = talents.map((talent) => {
      if (talents[index].id === talent.id) {
        return { ...talent, totalSupply: totalSupply };
      } else {
        return { ...talent };
      }
    });

    return newArray;
  };

  useEffect(() => {
    if (!loadingIndex0 && talentIndex0Data?.talentToken) {
      setLocalTalents((prev) => {
        const totalSupply = ethers.utils.formatUnits(
          talentIndex0Data.talentToken.totalSupply || 0
        );
        return addTokenDetails(prev, totalSupply, 0);
      });
    }
  }, [loadingIndex0, talentIndex0Data]);

  useEffect(() => {
    if (!loadingIndex1 && talentIndex1Data?.talentToken) {
      setLocalTalents((prev) => {
        const totalSupply = ethers.utils.formatUnits(
          talentIndex1Data.talentToken.totalSupply || 0
        );
        return addTokenDetails(prev, totalSupply, 1);
      });
    }
  }, [loadingIndex1, talentIndex1Data]);

  useEffect(() => {
    if (!loadingIndex2 && talentIndex2Data?.talentToken) {
      setLocalTalents((prev) => {
        const totalSupply = ethers.utils.formatUnits(
          talentIndex2Data.talentToken.totalSupply || 0
        );
        return addTokenDetails(prev, totalSupply, 2);
      });
    }
  }, [loadingIndex2, talentIndex2Data]);

  return (
    <div className={cx("highlights-card", className)}>
      <div className="d-flex justify-content-between align-items-center p-4 highlights-card-title">
        <div className="d-flex align-items-center">
          <span className="mr-2">{icon()}</span>
          <P1 className="text-black" bold text={title} />
        </div>
        <div className="d-flex align-items-center text-primary">
          <Link type="primary" text="Discover All" href="/talent" bold />
          <ArrowForward className="ml-2" color="currentColor" size={12} />
        </div>
      </div>
      {!mobile && <Divider />}
      {!mobile && (
        <div className="p-4 highlights-card-body">
          {localTalents.map((talent, index) => (
            <div
              key={`${talent.id}-${index}`}
              className="d-flex justify-content-between highlights-card-user"
            >
              <div className="d-flex align-items-center">
                <TalentProfilePicture
                  src={talent.profilePictureUrl}
                  height={32}
                />
                <P2 className="text-black ml-3" text={talent.name} />
              </div>
              {title === "Launching Soon" ? (
                <Tag className="coming-soon-tag align-self-center ml-2">
                  <P3 className="current-color" bold text="Coming Soon" />
                </Tag>
              ) : (
                <div className="d-flex flex-column align-items-end">
                  <P3 className="text-primary-04" text="Market cap" />
                  <P2
                    className="text-black"
                    text={currency(talent.totalSupply).format()}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

HighlightsCard.defaultProps = {
  talents: [],
  className: "",
};

HighlightsCard.propTypes = {
  title: string.isRequired,
  talents: arrayOf(
    shape({
      id: number,
      name: string,
      profilePictureUrl: string,
      circulatingSupply: number,
    })
  ),
  className: string,
};

export default (props) => (
  <ApolloProvider client={client(props.railsContext.contractsEnv)}>
    <HighlightsCard {...props} />
  </ApolloProvider>
);

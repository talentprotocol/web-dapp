import React from "react";
import { ethers } from "ethers";

import { P1, P2, P3, Caption } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";

const Perk = ({
  mode,
  area,
  title,
  myTokens,
  tokens,
  ticker,
  className = "",
  href,
  hideAction,
}) => {
  const goToRoute = () => {
    if (hideAction || myTokens < tokens) {
      return;
    }
    window.location.href = href;
  };

  return (
    <div
      className={`card card-hover${
        hideAction ? "" : " cursor-pointer"
      } ${mode} ${className}`}
      onClick={goToRoute}
    >
      <div className="d-flex justify-content-between">
        <Caption className={`perk-area`} text={area} />

        <div className={`text-right ${mode}`}>
          {myTokens >= tokens ? (
            <Tag className="tag-available" mode={mode}>
              <P3 bold text="Available" className="tag-available-label" />
            </Tag>
          ) : (
            <Tag className="tag-unavailable" mode={mode}>
              <P3 bold className="tag-unavailable-label">
                Hold more {ethers.utils.commify(tokens - myTokens)} {ticker}
              </P3>
            </Tag>
          )}
        </div>
      </div>
      <P1 bold text={title} className="mb-6 text-black" />
      <P2
        className="hold-info text-primary"
        mode={`${mode}`}
        text={`Hold +${ethers.utils.commify(tokens)} ${ticker}`}
      />
    </div>
  );
};

export default Perk;

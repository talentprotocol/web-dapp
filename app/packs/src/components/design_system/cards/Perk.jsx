import React from "react";
import { ethers } from "ethers";

import { P1, P2, P3, Caption } from "src/components/design_system/typography";
import Tag from "src/components/design_system/tag";

const Perk = ({
  mode,
  area,
  title,
  tokensLeftToRedeem,
  tokens,
  ticker,
  className = "",
  href,
  hideAction,
}) => {
  const disabled = hideAction || tokensLeftToRedeem > 0;

  return (
    <a
      className={`card ${mode} ${disabled ? "disabled" : ""} ${className}`}
      href={href}
    >
      <div className="d-flex justify-content-between">
        <Caption className={`perk-area`} text={area} />

        <div className={`text-right ${mode}`}>
          {tokensLeftToRedeem === 0 ? (
            <Tag className="tag-available" mode={mode}>
              <P3 bold text="Available" className="tag-available-label" />
            </Tag>
          ) : (
            <Tag className="tag-unavailable" mode={mode}>
              <P3 bold className="tag-unavailable-label">
                Hold more {ethers.utils.commify(tokensLeftToRedeem)} {ticker}
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
    </a>
  );
};

export default Perk;

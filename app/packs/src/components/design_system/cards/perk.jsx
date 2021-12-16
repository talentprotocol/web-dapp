import React from "react";
import Caption from "src/components/design_system/typography/caption";

const Perk = ({ mode, area, title, my_tokens, tokens, ticker }) => {
  return (
    <div className={`col-md-3 card ${mode}`}>
      <div className="row mb-1">
        <Caption
          className={`col-lg-6 perk-area text-uppercase`}
          mode={`${mode}`}
          text={`${area}`}
        ></Caption>

        <div className={`col-lg-6 text-right ${mode}`}>
          {my_tokens >= tokens ? (
            <span className={`tag-available ${mode}`}>
              <strong>Available</strong>
            </span>
          ) : (
            <span className={`tag-unavailable ${mode}`}>
              <strong>
                Hold more {tokens - my_tokens} {ticker}
              </strong>
            </span>
          )}
        </div>
      </div>
      <strong>{title}</strong>

      <Caption
        className="mt-1 hold-info"
        mode={`${mode}`}
        text={`Hold +${tokens} ${ticker}`}
      ></Caption>
    </div>
  );
};

export default Perk;

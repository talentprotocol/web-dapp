import React from "react";
import Caption from "src/components/design_system/typography/caption";

const Perk = ({
  mode,
  area,
  title,
  my_tokens,
  tokens,
  ticker,
  className = "",
  href,
  hideAction,
}) => {
  const goToRoute = () => {
    if (hideAction) {
      return;
    }
    window.location.href = href;
  };

  return (
    <div
      className={`card${
        hideAction ? "" : " cursor-pointer"
      } ${mode} ${className}`}
      onClick={goToRoute}
    >
      <div className="row mb-1">
        <Caption
          className={`col-lg-6 perk-area text-uppercase`}
          mode={`${mode}`}
          text={`${area}`}
        />

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
        className="mt-3 hold-info text-primary"
        mode={`${mode}`}
        text={`Hold +${tokens} ${ticker}`}
      />
    </div>
  );
};

export default Perk;

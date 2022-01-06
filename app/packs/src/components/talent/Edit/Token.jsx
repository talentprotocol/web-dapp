import React, { useState } from "react";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import TokenDetails from "src/components/talent/Show/TokenDetails";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight, ArrowLeft } from "src/components/icons";

const Token = (props) => {
  const { mode, token, user, railsContext, mobile, changeTab } = props;
  const [ticker, setTicker] = useState(token.ticker);

  if (token.contract_id) {
    return (
      <>
        <H5 className="w-100 text-left" mode={mode} text={ticker} bold />
        <P2 className="w-100 text-left" mode={mode}>
          You can see all your token activity on your{" "}
          <a href="/portfolio" target="_blank">
            portfolio
          </a>
        </P2>
        <TokenDetails
          ticker={token.ticker}
          token={token}
          displayName={user.display_name || user.username}
          username={user.username}
          railsContext={railsContext}
          mobile={mobile}
          className="w-100 mb-4"
          removeFixedPosition
        />
        {mobile && (
          <div className="d-flex flex-row justify-content-between w-100 mt-4 mb-3">
            <div className="d-flex flex-column">
              <Caption text="PREVIOUS" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Goal")}
              >
                <ArrowLeft color="currentColor" /> Goal
              </div>
            </div>
            <div className="d-flex flex-column">
              <Caption text="NEXT" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Perks")}
              >
                Perks <ArrowRight color="currentColor" />
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <H5
        className="w-100 text-left"
        mode={mode}
        text="Launch your Talent Token today!"
        bold
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <P2 className="w-100 text-left mr-3" mode={mode}>
          Please be sure you have an active Metamask wallet. If you don't have
          one, please create it using{" "}
          <a href="www.metamask.io" target="_blank">
            Metamask.io
          </a>
        </P2>
        <Button
          onClick={() => console.log("saving")}
          type="primary-default"
          mode={mode}
        >
          Launch Talent Token
        </Button>
      </div>
      <div className={`divider ${mode} my-3`}></div>
      <TextInput
        title={"Ticker Name"}
        mode={mode}
        placeholder={"3 to 8 characters"}
        shortCaption={
          "Your ticker name will be visible next to your display name. You need to launch your talent token to enable buying your token."
        }
        onChange={(e) => setTicker(e.target.value)}
        value={ticker}
        className="w-100 mt-3"
        maxLength={8}
      />
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Goal")}
            >
              <ArrowLeft color="currentColor" /> Goal
            </div>
          </div>
          <div className="d-flex flex-column">
            <Caption text="NEXT" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Perks")}
            >
              Perks <ArrowRight color="currentColor" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Token;

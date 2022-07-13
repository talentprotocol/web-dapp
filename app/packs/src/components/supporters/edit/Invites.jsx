import React, { useState } from "react";

import { H5, P2, Caption } from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import { ArrowLeft, ArrowRight, Check } from "src/components/icons";
import Divider from "src/components/design_system/other/Divider";

const Invites = ({
  invites,
  mobile,
  changeTab,
  setShowApplyToLaunchTokenModal,
}) => {
  const [copied, setCopied] = useState({});

  const addInviteToClipboard = (invite) => {
    setCopied((prev) => ({ ...prev, [invite.id]: true }));
    navigator.clipboard.writeText(
      `${window.location.origin}/sign_up?code=${invite.code}`
    );

    setTimeout(
      () => setCopied((prev) => ({ ...prev, [invite.id]: false })),
      2000
    );
  };

  return (
    <>
      <H5 className="w-100 text-left" text="Invites" bold />
      <P2 className="w-100 text-left" text="Manage your invites" />
      {invites.length == 0 ? (
        <P2 className="w-100 text-left">
          You current don't have any active invites.
        </P2>
      ) : (
        ""
      )}
      {invites.map((invite) => (
        <div className="w-100" key={`invite-${invite.id}`}>
          <div className="d-flex flex-row flex-wrap w-100 justify-content-between align-items-end mt-2">
            <P2 className="w-100 p2 text-left" bold>
              {`${invite.talent_invite ? "Talent" : "Supporter"}`} invite
            </P2>
            <P2 className="w-100">
              Invite your friends to join the Talent Protocol platform as
              supporters.
            </P2>
            <div className="col-8 d-flex flex-column p-0 mt-2">
              <P2 className="p2 text-left">
                {invite.max_uses !== null
                  ? `Uses: ${invite.uses}/${invite.max_uses}`
                  : `Uses: ${invite.uses}`}
              </P2>
              <P2 className="p2 text-left">{`Code: ${invite.code}`}</P2>
            </div>
            <div className={mobile ? "my-4" : ""}>
              <Button
                onClick={() => addInviteToClipboard(invite)}
                type="primary-default"
              >
                Copy invite link{" "}
                {copied[invite.id] ? (
                  <Check color="currentColor" className="ml-2" />
                ) : (
                  ""
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
      {mobile && (
        <>
          <div className="d-flex flex-row justify-content-between w-100 my-3">
            <div className="d-flex flex-column">
              <Caption text="PREVIOUS" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("About")}
              >
                <ArrowLeft color="currentColor" /> About
              </div>
            </div>
            <div className="d-flex flex-column">
              <Caption text="NEXT" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Settings")}
              >
                Settings <ArrowRight color="currentColor" />
              </div>
            </div>
          </div>
          <Divider className="my-4" />
          <div className="w-100">
            <Button
              className="w-100"
              onClick={() => setShowApplyToLaunchTokenModal(true)}
              type="primary-default"
              size="big"
              text="Apply to Launch Token"
            />
          </div>
        </>
      )}
    </>
  );
};

export default Invites;

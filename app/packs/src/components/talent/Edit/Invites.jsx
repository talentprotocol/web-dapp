import React, { useState } from "react";

import { H5, P2, Caption } from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import { ArrowLeft, ArrowRight, Check } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";
import Divider from "src/components/design_system/other/Divider";

const Invites = (props) => {
  const {
    mobile,
    changeTab,
    mode,
    togglePublicProfile,
    publicButtonType,
    disablePublicButton,
    invites,
  } = props;
  const [copied, setCopied] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });

  const onTogglePublic = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await togglePublicProfile();
    setSaving((prev) => ({ ...prev, loading: false, public: true }));
  };

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
        <div key={`invite-${invite.id}`}>
          <Divider className="my-4" />
          <div className="d-flex flex-row w-100 justify-content-between align-items-end mt-2">
            <div className="col-8 d-flex flex-column p-0">
              <P2 className="p2 text-left" bold>
                {`${invite.talent_invite ? "Talent" : "Supporter"}`} invite
              </P2>
              <P2 className="p2 text-left">
                {invite.max_uses !== null
                  ? `Uses: ${invite.uses}/${invite.max_uses}`
                  : `Uses: ${invite.uses}`}
              </P2>
              <P2 className="p2 text-left">{`Code: ${invite.code}`}</P2>
            </div>
            <div>
              <Button
                onClick={() => addInviteToClipboard(invite)}
                type="primary-default"
                mode={mode}
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
        <div className="d-flex flex-row justify-content-between w-100 my-3">
          <div className="d-flex flex-column">
            <Caption text="PREVIOUS" />
            <div
              className="text-grey cursor-pointer"
              onClick={() => changeTab("Perks")}
            >
              <ArrowLeft color="currentColor" /> Perks
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
      )}
      {mobile && (
        <div
          className={`d-flex flex-row ${
            mobile ? "justify-content-between" : ""
          } w-100 pb-4`}
        >
          <LoadingButton
            onClick={() => onTogglePublic()}
            type={publicButtonType}
            disabled={disablePublicButton || saving["loading"]}
            mode={mode}
            loading={saving["loading"]}
            success={props.talent.public}
            className="ml-auto mr-3"
            checkClassName="edit-profile-public-check"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </LoadingButton>
        </div>
      )}
    </>
  );
};

export default Invites;

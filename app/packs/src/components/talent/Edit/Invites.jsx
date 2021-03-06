import React, { useState } from "react";

import {
  H5,
  P1,
  P2,
  P3,
  Caption,
} from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import { ArrowLeft, ArrowRight, Check } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";

const TALENT_TEXT =
  "Invite a talented friend to launch a token. They skip the traditional application process and receive $200 USD.";
const SUPPORTER_TEXT =
  "Invite your friends to join the Talent Protocol platform as supporters.";

const InviteCard = ({
  title,
  code,
  onClick,
  mode,
  copied,
  explanation,
  uses,
}) => {
  return (
    <div className="w-100 invite-card p-4 d-flex flex-column my-2">
      <P1 bold>{title}</P1>
      <P2>{explanation}</P2>
      <P2 className="mt-2">{uses}</P2>
      <div className="w-100 d-flex flex-row justify-content-between align-items-end mt-2">
        <div className="d-flex flex-column">
          <P3>Code</P3>
          <P2 bold>{code}</P2>
        </div>
        <Button onClick={onClick} type="primary-default" mode={mode}>
          Copy invite link{" "}
          {copied ? <Check color="currentColor" className="ml-2" /> : ""}
        </Button>
      </div>
    </div>
  );
};

const Invites = (props) => {
  const {
    mobile,
    changeTab,
    mode,
    onProfileButtonClick,
    publicButtonType,
    disablePublicButton,
    invites,
    buttonText,
  } = props;
  const [copied, setCopied] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });

  const onTogglePublic = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await onProfileButtonClick();
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
        <InviteCard
          key={`invite-${invite.id}`}
          title={`${invite.talent_invite ? "Talent" : "Supporter"} invite`}
          explanation={invite.talent_invite ? TALENT_TEXT : SUPPORTER_TEXT}
          code={invite.code}
          onClick={() => addInviteToClipboard(invite)}
          mode={mode}
          copied={copied[invite.id]}
          uses={
            invite.max_uses !== null
              ? `Uses: ${invite.uses}/${invite.max_uses}`
              : `Uses: ${invite.uses}/(unlimited)`
          }
        />
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
      {mobile && buttonText != "N/A" && (
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
            {buttonText}
          </LoadingButton>
        </div>
      )}
    </>
  );
};

export default Invites;

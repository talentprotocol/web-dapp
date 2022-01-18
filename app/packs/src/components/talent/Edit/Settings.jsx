import React, { useState } from "react";

import { destroy, patch } from "src/utils/requests";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import Caption from "src/components/design_system/typography/caption";
import { ArrowLeft } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";

const Settings = (props) => {
  const {
    user,
    mobile,
    changeTab,
    mode,
    changeSharedState,
    togglePublicProfile,
    publicButtonType,
    disablePublicButton,
  } = props;
  const [settings, setSettings] = useState({
    username: user.username || "",
    email: user.email || "",
    currentPassword: "",
    newPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });

  const changeAttribute = (attribute, value) => {
    if (attribute == "currentPassword" && validationErrors?.currentPassword) {
      setValidationErrors((prev) => ({ ...prev, currentPassword: false }));
    }
    setSettings((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const updateUser = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));

    const response = await patch(`/api/v1/users/${user.id}`, {
      user: {
        ...settings,
        current_password: settings.currentPassword,
        new_password: settings.newPassword,
      },
    }).catch(() => setValidationErrors((prev) => ({ ...prev, saving: true })));

    if (response) {
      if (!response.errors) {
        changeSharedState((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...response.user,
          },
        }));
        setSettings((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
        }));
        setSaving((prev) => ({ ...prev, loading: false, profile: true }));
      } else {
        setValidationErrors((prev) => ({ ...prev, ...response.errors }));
      }
    }

    setSaving((prev) => ({ ...prev, loading: false }));
  };

  const deleteUser = async () => {
    const response = await destroy(`/api/v1/users/${user.id}`).catch(() =>
      setValidationErrors((prev) => ({ ...prev, deleting: true }))
    );

    if (response && response.success) {
      window.location.href = "/";
    } else {
      setValidationErrors((prev) => ({ ...prev, deleting: true }));
    }
  };

  const onTogglePublic = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await togglePublicProfile();
    setSaving((prev) => ({ ...prev, loading: false, public: true }));
  };

  return (
    <>
      <H5
        className="w-100 text-left"
        mode={mode}
        text="Account Settings"
        bold
      />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Update your username and manage your account"
      />
      <div className="d-flex flex-row w-100 flex-wrap justify-content-between mt-3">
        <TextInput
          title={"Username"}
          mode={mode}
          shortCaption={`Your Talent Protocol URL: /talent/${settings["username"]}`}
          onChange={(e) => changeAttribute("username", e.target.value)}
          value={settings["username"]}
          className="w-100"
          required={true}
          error={validationErrors?.username}
        />
        {validationErrors?.username && (
          <Caption className="text-danger" text="Username is already taken." />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-3">
        <TextInput
          title={"Email"}
          type="email"
          mode={mode}
          onChange={(e) => changeAttribute("email", e.target.value)}
          value={settings["email"]}
          className="w-100"
          required={true}
          error={validationErrors?.email}
        />
        {validationErrors?.email && (
          <Caption className="text-danger" text="Email is already taken." />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-3">
        <TextInput
          title={"Current Password"}
          type="password"
          placeholder={"*********"}
          mode={mode}
          onChange={(e) => changeAttribute("currentPassword", e.target.value)}
          value={settings["currentPassword"]}
          className="w-100"
          required={true}
          error={validationErrors?.currentPassword}
        />
        {validationErrors?.currentPassword && (
          <Caption className="text-danger" text="Password doesn't match." />
        )}
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"New Password"}
          type="password"
          placeholder={"*********"}
          mode={mode}
          onChange={(e) => changeAttribute("newPassword", e.target.value)}
          value={settings["newPassword"]}
          className="w-100"
          required={true}
          error={validationErrors?.newPassword}
        />
      </div>
      <Button
        onClick={() => updateUser()}
        type="primary-default"
        mode={mode}
        className="mt-3 w-100"
      >
        Change password
      </Button>
      <div className={`divider ${mode} my-3`}></div>
      <div className="d-flex flex-row w-100 justify-content-between my-3">
        <div className={`d-flex flex-column ${mobile ? "w-100" : "w-50 mr-2"}`}>
          <H5
            className="w-100 text-left"
            mode={mode}
            text="Close Account"
            bold
          />
          <P2
            className="w-100 text-left"
            mode={mode}
            text="Delete your account and account data"
          />
        </div>
        <div>
          <Button
            onClick={() => deleteUser()}
            type="danger-default"
            mode={mode}
          >
            Delete Account
          </Button>
        </div>
      </div>
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
        </div>
      )}
      <div
        className={`d-flex flex-row ${
          mobile ? "justify-content-between" : "justify-content-end"
        } w-100`}
      >
        {mobile && (
          <LoadingButton
            onClick={() => onTogglePublic()}
            type={publicButtonType}
            disabled={disablePublicButton || saving["loading"]}
            mode={mode}
            loading={saving["loading"]}
            success={saving["public"]}
            className="ml-auto mr-3"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </LoadingButton>
        )}
        <LoadingButton
          onClick={() => updateUser()}
          type="white-subtle"
          mode={mode}
          disabled={saving["loading"]}
          loading={saving["loading"]}
          success={saving["profile"]}
          className="text-black"
        >
          Save Profile
        </LoadingButton>
      </div>
    </>
  );
};

export default Settings;

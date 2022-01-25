import React, { useState, useEffect } from "react";

import { destroy, patch } from "src/utils/requests";

import { H5, P2, P3 } from "src/components/design_system/typography";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import { ArrowLeft } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";
import Divider from "src/components/design_system/other/divider";
import Tag from "src/components/design_system/tag";

import { passwordMatchesRequirements } from "src/components/talent/utils/passwordRequirements";

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
  const [validationErrors, setValidationErrors] = useState({
    username: false,
    currentPassword: false,
    newPassword: false,
  });
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });
  const {
    valid: validPassword,
    errors,
    tags,
  } = passwordMatchesRequirements(settings.newPassword);
  const usernameRegex = /^[a-z0-9]*$/;

  const changeAttribute = (attribute, value) => {
    if (attribute == "currentPassword" && validationErrors.currentPassword) {
      setValidationErrors((prev) => ({ ...prev, currentPassword: false }));
    }
    if (attribute == "username") {
      if (usernameRegex.test(value)) {
        setValidationErrors((prev) => ({ ...prev, username: false }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          username: "Username only allows lower case letters and numbers",
        }));
      }
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
    const response = await destroy(`/api/v1/users/${user.id}`, {
      user: { current_password: settings.currentPassword },
    }).catch(() =>
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

  const cannotSaveSettings = () =>
    settings.username.length == 0 ||
    !!validationErrors.username ||
    !!validationErrors.currentPassword ||
    !!validationErrors.newPassword ||
    (!!settings.newPassword && !validPassword);

  const cannotChangePassword = () =>
    !!validationErrors.currentPassword ||
    !!validationErrors.newPassword ||
    settings.currentPassword.length < 8 ||
    settings.newPassword.length < 8 ||
    (!!settings.newPassword && !validPassword);

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
      <div className="d-flex flex-row w-100 flex-wrap justify-content-between mt-4">
        <TextInput
          title={"Username"}
          mode={mode}
          shortCaption={`Your Talent Protocol URL: /talent/${settings.username}`}
          onChange={(e) => changeAttribute("username", e.target.value)}
          value={settings.username}
          className="w-100"
          required
          error={validationErrors.username}
        />
        {validationErrors.username && (
          <P3 className="text-danger" text={validationErrors.username} />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-4">
        <TextInput
          title={"Email"}
          type="email"
          mode={mode}
          onChange={(e) => changeAttribute("email", e.target.value)}
          value={settings.email}
          className="w-100"
          required
          error={validationErrors.email}
        />
        {validationErrors.email && (
          <P3 className="text-danger" text="Email is already taken." />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-4">
        <TextInput
          title={"Current Password"}
          type="password"
          placeholder={"*********"}
          mode={mode}
          onChange={(e) => changeAttribute("currentPassword", e.target.value)}
          value={settings.currentPassword}
          className="w-100"
          required
          error={validationErrors.currentPassword}
        />
        {validationErrors?.currentPassword && (
          <P3 className="text-danger" text="Password doesn't match." />
        )}
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"New Password"}
          type="password"
          placeholder={"*********"}
          mode={mode}
          onChange={(e) => changeAttribute("newPassword", e.target.value)}
          value={settings.newPassword}
          className="w-100"
          error={validationErrors.newPassword}
        />
      </div>
      <div className="d-flex flex-wrap">
        {tags.map((tag) => (
          <Tag
            className={`mr-2 mt-2${errors[tag] ? "" : " bg-success"}`}
            key={tag}
          >
            <P3 text={tag} bold className={errors[tag] ? "" : "text-white"} />
          </Tag>
        ))}
      </div>
      <Button
        onClick={() => updateUser()}
        type="primary-default"
        mode={mode}
        disabled={cannotChangePassword()}
        className="mt-4 mb-4 w-100"
      >
        Change password
      </Button>
      {mobile && (
        <div className="d-flex flex-row justify-content-between w-100 mb-3">
          <div className="d-flex flex-column">
            <P3 text="PREVIOUS" />
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
          mobile ? "justify-content-between" : "mt-4"
        } w-100 pb-4`}
      >
        {mobile && (
          <LoadingButton
            onClick={() => onTogglePublic()}
            type={publicButtonType}
            disabled={disablePublicButton || saving.loading}
            mode={mode}
            loading={saving.loading}
            success={saving.public}
            className="ml-auto mr-3"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </LoadingButton>
        )}
        <LoadingButton
          onClick={() => updateUser()}
          type="primary-default"
          mode={mode}
          disabled={saving.loading || cannotSaveSettings()}
          loading={saving.loading}
          success={saving.profile}
          className="text-black"
        >
          Save Profile
        </LoadingButton>
      </div>
      <Divider className="mb-4" />
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
          {settings.currentPassword && validationErrors?.deleting && (
            <P3
              className="w-100 text-left text-danger"
              text="Unabled to destroy user."
            />
          )}
        </div>
        <div>
          <Button
            onClick={() => deleteUser()}
            type="danger-default"
            mode={mode}
            disabled={!settings.currentPassword}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </>
  );
};

export default Settings;

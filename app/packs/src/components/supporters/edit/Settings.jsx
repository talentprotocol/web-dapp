import React, { useState } from "react";
import Form from "react-bootstrap/Form";

import "@uppy/core/dist/style.css";
import "@uppy/file-input/dist/style.css";

import { patch, destroy } from "src/utils/requests";

import { ArrowLeft } from "src/components/icons";
import { H5, P2, P3 } from "src/components/design_system/typography";
import TextInput from "src/components/design_system/fields/textinput";
import Checkbox from "src/components/design_system/checkbox";
import Button from "src/components/design_system/button";
import LoadingButton from "src/components/button/LoadingButton";
import Divider from "src/components/design_system/other/Divider";
import Tag from "src/components/design_system/tag";

import { passwordMatchesRequirements } from "src/utils/passwordRequirements";
import { emailRegex, usernameRegex } from "src/utils/regexes";

const NotificationInputs = [
  {
    description: "Someone sent you a chat message",
    name: "MessageReceivedNotification",
  },
];

const Settings = ({
  id,
  username,
  email,
  currentPassword,
  newPassword,
  deletePassword,
  messagingDisabled,
  notificationPreferences,
  mobile,
  changeTab,
  changeSharedState,
  trackChanges,
  setShowApplyToLaunchTokenModal,
}) => {
  const [validationErrors, setValidationErrors] = useState({});
  const [emailValidated, setEmailValidated] = useState(true);
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
  });
  const {
    valid: validPassword,
    errors,
    tags,
  } = passwordMatchesRequirements(newPassword);
  const [notifications, setNotifications] = useState({
    saving: false,
    success: false,
  });

  const updateUser = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));

    const response = await patch(`/api/v1/users/${id}`, {
      user: {
        email: email,
        username: username,
        messaging_disabled: messagingDisabled,
        new_password: newPassword,
        current_password: currentPassword,
      },
    }).catch(() => setValidationErrors((prev) => ({ ...prev, saving: true })));

    if (response) {
      if (!response.errors) {
        setSaving((prev) => ({ ...prev, loading: false, profile: true }));
        changeSharedState((prev) => ({
          ...prev,
          newPassword: "",
          currentPassword: "",
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, ...response.errors }));
      }
    }

    setSaving((prev) => ({ ...prev, loading: false }));
    trackChanges(false);
  };

  const deleteUser = async () => {
    const response = await destroy(`/api/v1/users/${id}`, {
      user: { current_password: deletePassword },
    }).catch(() =>
      setValidationErrors((prev) => ({ ...prev, deleting: true }))
    );

    if (response && response.success) {
      window.location.href = "/";
    } else {
      setValidationErrors((prev) => ({ ...prev, deleting: true }));
    }
  };

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
    } else if (attribute === "email") {
      setValidationErrors((prev) => ({ ...prev, email: false }));
      setEmailValidated(false);
      if (emailRegex.test(value)) validateEmail(value);
    }
    if (attribute == "deletePassword") {
      setValidationErrors((prev) => ({ ...prev, deleting: false }));
    }
    changeSharedState((prevInfo) => ({ ...prevInfo, [attribute]: value }));
    trackChanges(true);
  };

  const cannotSaveSettings = () =>
    !emailValidated ||
    !!validationErrors.email ||
    username.length == 0 ||
    !!validationErrors.username ||
    !!validationErrors.currentPassword ||
    !!validationErrors.newPassword ||
    (!!newPassword && !validPassword);

  const cannotChangePassword = () =>
    !!validationErrors.currentPassword ||
    !!validationErrors.newPassword ||
    currentPassword.length < 8 ||
    newPassword.length < 8 ||
    (!!newPassword && !validPassword);

  const validateEmail = (value) => {
    if (emailRegex.test(value)) {
      setValidationErrors((prev) => ({ ...prev, email: false }));
      setEmailValidated(true);
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Email is not valid",
      }));
      setEmailValidated(false);
    }
  };

  const setNotificationSettings = (name) => (event) => {
    const value = parseInt(event.currentTarget.value, 10);
    const preferences = { ...notificationPreferences, [name]: value };
    changeSharedState((prev) => ({
      ...prev,
      notificationPreferences: preferences,
    }));
    trackChanges(true);
  };

  const updateNotificationSettings = async () => {
    let success = true;
    setNotifications((prev) => ({ ...prev, saving: true, success: false }));

    const response = await patch(`/api/v1/users/${id}`, {
      user: {
        notification_preferences: notificationPreferences,
      },
    }).catch(() => (success = false));

    success = success && response && !response.errors;
    setNotifications((prev) => ({ ...prev, saving: false, success }));
    trackChanges(false);
  };

  return (
    <>
      <H5 className="w-100 text-left" text="Account Settings" bold />
      <P2
        className="w-100 text-left"
        text="Update your username and manage your account"
      />
      <div className="d-flex flex-row w-100 flex-wrap mt-4">
        <TextInput
          title={"Username"}
          onChange={(e) => changeAttribute("username", e.target.value)}
          value={username}
          className="w-100"
          required={true}
          error={validationErrors?.username}
        />
        {validationErrors?.username && (
          <P3 className="text-danger" text={validationErrors.username} />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-4">
        <TextInput
          title={"Email"}
          type="email"
          onChange={(e) => changeAttribute("email", e.target.value)}
          value={email}
          className="w-100"
          required={true}
          error={validationErrors?.email}
        />
        {validationErrors?.email && (
          <P3 className="text-danger" text={validationErrors.email} />
        )}
      </div>

      <div className="d-flex flex-column w-100 flex-wrap mt-4">
        <P2 bold className="text-black mb-2">
          Disable Messages
        </P2>

        <Checkbox
          className="form-check-input mt-4"
          checked={messagingDisabled}
          onChange={() =>
            changeAttribute("messagingDisabled", !messagingDisabled)
          }
        >
          <div className="d-flex flex-wrap">
            <P2 className="mr-1" text="I don't want to receive messages" />
          </div>
        </Checkbox>
      </div>

      <div className={"d-flex flex-row justify-content-start w-100 mt-4"}>
        <LoadingButton
          onClick={() => updateUser()}
          type="primary-default"
          disabled={saving.loading || cannotSaveSettings()}
          loading={saving.loading}
          success={saving.profile}
        >
          Save Profile
        </LoadingButton>
      </div>
      <div className="d-flex flex-row w-100 mt-4">
        <TextInput
          title={"Current Password"}
          type="password"
          placeholder={"*********"}
          onChange={(e) => changeAttribute("currentPassword", e.target.value)}
          value={currentPassword}
          className="w-100"
          required={true}
          error={validationErrors?.currentPassword}
        />
        {validationErrors?.currentPassword && (
          <P3 className="text-danger" text="Password doesn't match." />
        )}
      </div>
      <div className="d-flex flex-row w-100 mt-4">
        <TextInput
          title={"New Password"}
          type="password"
          placeholder={"*********"}
          onChange={(e) => changeAttribute("newPassword", e.target.value)}
          value={newPassword}
          className="w-100"
          required={true}
          error={validationErrors?.newPassword}
        />
      </div>
      <div className="d-flex flex-wrap w-100">
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
        disabled={cannotChangePassword()}
        className="mt-4 w-100"
      >
        Change password
      </Button>
      <Divider className="mb-4" />
      <div className="d-flex flex-column w-100 my-3">
        <H5
          className="w-100 text-left"
          text="Email Notification Settings"
          bold
        />
        <P2
          className="w-100 text-left"
          text="For each type of notification you can select to receive an immediate email notification, a daily email digest or to not receive any email."
        />

        {NotificationInputs.map((input) => (
          <div
            className="d-flex flex-row w-100 flex-wrap mt-4"
            key={input.name}
          >
            <div className="d-flex flex-column w-100">
              <div className="d-flex flex-row justify-content-between align-items-end">
                <P2 bold className="text-black mb-2">
                  {input.description}
                </P2>
              </div>
              <Form.Control
                as="select"
                onChange={setNotificationSettings(input.name)}
                value={notificationPreferences[input.name]}
                className="height-auto"
              >
                <option value="0">Disabled</option>
                <option value="1">Immediate</option>
                <option value="2">Digest</option>
              </Form.Control>
            </div>
          </div>
        ))}
        <div className={`d-flex flex-row mt-4 w-100 pb-4`}>
          <LoadingButton
            onClick={updateNotificationSettings}
            type="primary-default"
            loading={notifications.saving}
            disabled={notifications.saving}
            success={notifications.success}
          >
            Save Settings
          </LoadingButton>
        </div>
      </div>
      <Divider className="my-4" />
      <div className="d-flex flex-column w-100 my-3">
        <H5 className="w-100 text-left" text="Close Account" bold />
        <P2
          className="w-100 text-left"
          text="Delete your account and account data"
        />
        <TextInput
          title={"Password"}
          type="password"
          placeholder={"*********"}
          onChange={(e) => changeAttribute("deletePassword", e.target.value)}
          value={deletePassword}
          className="w-100 mt-4"
          required
          error={validationErrors.deleting}
        />
        {validationErrors?.deleting && (
          <P3 className="text-danger" text="Wrong password." />
        )}
        <Button
          onClick={() => deleteUser()}
          type="danger-default"
          className="w-100 mt-3"
          disabled={deletePassword == ""}
        >
          Delete Account
        </Button>
      </div>
      {mobile && (
        <>
          <div className="d-flex flex-row justify-content-between w-100 my-3">
            <div className="d-flex flex-column">
              <P3 text="PREVIOUS" />
              <div
                className="text-grey cursor-pointer"
                onClick={() => changeTab("Invites")}
              >
                <ArrowLeft color="currentColor" /> Invites
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

export default Settings;

import React, { useState, useContext, useEffect } from "react";
import Uppy from "@uppy/core";
import { FileInput } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import Form from "react-bootstrap/Form";

import "@uppy/core/dist/style.css";
import "@uppy/file-input/dist/style.css";

import { getAuthToken } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import { patch, destroy } from "src/utils/requests";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import { H5, P2, P3 } from "src/components/design_system/typography";
import TextInput from "src/components/design_system/fields/textinput";
import Checkbox from "src/components/design_system/checkbox";
import Button from "src/components/design_system/button";
import LoadingButton from "src/components/button/LoadingButton";
import Divider from "src/components/design_system/other/Divider";
import Tag from "src/components/design_system/tag";
import { Check } from "src/components/icons";

import { passwordMatchesRequirements } from "src/utils/passwordRequirements";
import { emailRegex, usernameRegex } from "src/utils/regexes";

const NotificationInputs = [
  {
    description: "Someone bought your talent token",
    name: "TokenAcquiredNotification",
  },
  {
    description: "Someone sent you a chat message",
    name: "MessageReceivedNotification",
  },
];

const uppyProfile = new Uppy({
  meta: { type: "avatar" },
  restrictions: {
    maxFileSize: 5120000,
    allowedFileTypes: [".jpg", ".png", ".jpeg"],
  },
  autoProceed: true,
});

uppyProfile.use(AwsS3Multipart, {
  limit: 4,
  companionUrl: "/",
  companionHeaders: {
    "X-CSRF-Token": getAuthToken(),
  },
});

const EditSupporter = ({
  id,
  username,
  email,
  messagingDisabled,
  profilePictureUrl,
  invites,
  notificationPreferences,
}) => {
  const [settings, setSettings] = useState({
    username: username || "",
    email: email || "",
    messagingDisabled: messagingDisabled,
    currentPassword: "",
    newPassword: "",
    deletePassword: "",
    profilePictureUrl: profilePictureUrl,
    s3Data: null,
    notificationPreferences: notificationPreferences,
  });
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [uploaded, setUploaded] = useState({ profile: false });
  const [validationErrors, setValidationErrors] = useState({});
  const [emailValidated, setEmailValidated] = useState(true);
  const [copied, setCopied] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
  });
  const {
    valid: validPassword,
    errors,
    tags,
  } = passwordMatchesRequirements(settings.newPassword);
  const [notifications, setNotifications] = useState({
    saving: false,
    success: false,
  });

  const theme = useContext(ThemeContext);

  useEffect(() => {
    uppyProfile.on("upload-success", (file, response) => {
      setSettings((prev) => ({
        ...prev,
        profilePictureUrl: response.uploadURL,
        s3Data: {
          id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
          storage: "cache",
          metadata: {
            size: file.size,
            filename: file.name,
            mime_type: file.type,
          },
        },
      }));
      setUploaded((prev) => ({ ...prev, profile: true }));
      setUploadingFileS3("");
    });
    uppyProfile.on("upload", () => {
      setUploadingFileS3("profile");
      setValidationErrors((prev) => ({ ...prev, profilePictureSize: false }));
    });
    uppyProfile.on("restriction-failed", () => {
      uppyProfile.reset();
      setValidationErrors((prev) => ({ ...prev, profilePictureSize: true }));
    });
  }, []);

  const updateUser = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));

    const response = await patch(`/api/v1/users/${id}`, {
      user: {
        email: settings.email,
        username: settings.username,
        messaging_disabled: settings.messagingDisabled,
        new_password: settings.newPassword,
        current_password: settings.currentPassword,
      },
      investor: {
        profile_picture_data: { ...settings.s3Data },
      },
    }).catch(() => setValidationErrors((prev) => ({ ...prev, saving: true })));

    if (response) {
      if (!response.errors) {
        setSaving((prev) => ({ ...prev, loading: false, profile: true }));
        setSettings((prev) => ({
          ...prev,
          newPassword: "",
          currentPassword: "",
        }));
      } else {
        setValidationErrors((prev) => ({ ...prev, ...response.errors }));
      }
    }

    setSaving((prev) => ({ ...prev, loading: false }));
  };

  const deleteUser = async () => {
    const response = await destroy(`/api/v1/users/${id}`, {
      user: { current_password: settings.deletePassword },
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
    setSettings((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

  const cannotSaveSettings = () =>
    !emailValidated ||
    !!validationErrors.email ||
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
    const preferences = { ...settings.notificationPreferences, [name]: value };
    setSettings((prev) => ({ ...prev, notificationPreferences: preferences }));
  };

  const updateNotificationSettings = async () => {
    let success = true;
    setNotifications((prev) => ({ ...prev, saving: true, success: false }));

    const response = await patch(`/api/v1/users/${id}`, {
      user: {
        notification_preferences: settings.notificationPreferences,
      },
    }).catch(() => (success = false));

    success = success && response && !response.errors;
    setNotifications((prev) => ({ ...prev, saving: false, success }));
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
    <div className="d-flex flex-column mx-auto align-items-center p-3 edit-profile-content">
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
          <Divider className="my-4" />
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
            <div>
              <Button
                onClick={() => addInviteToClipboard(invite)}
                type="primary-default"
                mode={theme.mode()}
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
      <Divider className="my-4" />
      <H5
        className="w-100 text-left"
        mode={theme.mode()}
        text="Account Settings"
        bold
      />
      <P2
        className="w-100 text-left"
        mode={theme.mode()}
        text="Update your username and manage your account"
      />
      <div className="d-flex flex-row w-100 align-items-center mt-4">
        <TalentProfilePicture src={settings.profilePictureUrl} height={80} />
        <div className="ml-3 d-flex flex-column">
          <div className="d-flex align-items-center">
            <FileInput
              uppy={uppyProfile}
              pretty
              inputName="files[]"
              locale={{
                strings: {
                  chooseFiles: "Choose Profile Picture",
                },
              }}
            />
            {uploadingFileS3 == "profile" && (
              <P2 text="Uploading" className="ml-2 text-black" bold />
            )}
            {uploadingFileS3 != "profile" && uploaded.profile && (
              <P2 text="Uploaded File" className="ml-2 text-black" bold />
            )}
            {validationErrors?.profilePictureSize && (
              <P2 text="File is too large." className="ml-2 text-danger" bold />
            )}
          </div>
          <P2 text="JPG or PNG. Max 1MB" mode={theme.mode()} />
        </div>
      </div>
      <div className="d-flex flex-row w-100 flex-wrap mt-4">
        <TextInput
          title={"Username"}
          mode={theme.mode()}
          onChange={(e) => changeAttribute("username", e.target.value)}
          value={settings.username}
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
          mode={theme.mode()}
          onChange={(e) => changeAttribute("email", e.target.value)}
          value={settings.email}
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
          checked={settings.messagingDisabled}
          onChange={() =>
            changeAttribute("messagingDisabled", !settings.messagingDisabled)
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
          mode={theme.mode()}
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
          mode={theme.mode()}
          onChange={(e) => changeAttribute("currentPassword", e.target.value)}
          value={settings.currentPassword}
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
          mode={theme.mode()}
          onChange={(e) => changeAttribute("newPassword", e.target.value)}
          value={settings.newPassword}
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
            <P3
              text={tag}
              bold
              className={errors[tag] ? "" : "permanent-text-white"}
            />
          </Tag>
        ))}
      </div>
      <Button
        onClick={() => updateUser()}
        type="primary-default"
        mode={theme.mode()}
        disabled={cannotChangePassword()}
        className="mt-4 w-100"
      >
        Change password
      </Button>
      <Divider className="mb-4" />
      <div className="d-flex flex-column w-100 my-3">
        <H5
          className="w-100 text-left"
          mode={theme.mode()}
          text="Email Notification Settings"
          bold
        />
        <P2
          className="w-100 text-left"
          mode={theme.mode()}
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
                value={settings.notificationPreferences[input.name]}
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
            mode={theme.mode()}
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
        <H5
          className="w-100 text-left"
          mode={theme.mode()}
          text="Close Account"
          bold
        />
        <P2
          className="w-100 text-left"
          mode={theme.mode()}
          text="Delete your account and account data"
        />
        <TextInput
          title={"Password"}
          type="password"
          placeholder={"*********"}
          mode={theme.mode()}
          onChange={(e) => changeAttribute("deletePassword", e.target.value)}
          value={settings.deletePassword}
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
          mode={theme.mode()}
          className="w-100 mt-3"
          disabled={settings.deletePassword == ""}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <EditSupporter {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};

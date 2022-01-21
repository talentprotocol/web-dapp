import React, { useState, useContext, useEffect } from "react";
import Uppy from "@uppy/core";
import { FileInput } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";

import "@uppy/core/dist/style.css";
import "@uppy/file-input/dist/style.css";

import { getAuthToken } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import { patch, destroy } from "src/utils/requests";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TextInput from "src/components/design_system/fields/textinput";
import Button from "src/components/design_system/button";
import Caption from "src/components/design_system/typography/caption";
import LoadingButton from "src/components/button/LoadingButton";

const setupUppy = () => {
  const uppyProfile = new Uppy({
    meta: { type: "avatar" },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
  });

  uppyProfile.use(AwsS3Multipart, {
    limit: 4,
    companionUrl: "/",
    companionHeaders: {
      "X-CSRF-Token": getAuthToken(),
    },
  });

  return { uppyProfile };
};

const EditSupporter = ({ id, username, email, profilePictureUrl }) => {
  const [localUsername, setLocalUsername] = useState(username);
  const [localPassword, setLocalPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [localEmail, setLocalEmail] = useState(email);
  const [localProfilePictureUrl, setLocalProfilePictureUrl] =
    useState(profilePictureUrl);
  const [s3Data, setS3Data] = useState(null);
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [uploaded, setUploaded] = useState({ profile: false });
  const [validationErrors, setValidationErrors] = useState({});
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
  });

  const { uppyProfile } = setupUppy();
  const theme = useContext(ThemeContext);

  useEffect(() => {
    uppyProfile.on("upload-success", (file, response) => {
      setLocalProfilePictureUrl(response.uploadURL);
      setS3Data({
        id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
        storage: "cache",
        metadata: {
          size: file.size,
          filename: file.name,
          mime_type: file.type,
        },
      });

      setUploaded((prev) => ({ ...prev, profile: true }));
      setUploadingFileS3("");
    });
    uppyProfile.on("upload", () => {
      setUploadingFileS3("profile");
    });
  }, []);

  const updateUser = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));

    const response = await patch(`/api/v1/users/${id}`, {
      user: {
        email: localEmail,
        username: localUsername,
        new_password: localPassword,
        current_password: currentPassword,
      },
      investor: {
        profile_picture_data: { ...s3Data },
      },
    }).catch(() => setValidationErrors((prev) => ({ ...prev, saving: true })));

    if (response) {
      if (!response.errors) {
        setSaving((prev) => ({ ...prev, loading: false, profile: true }));
        setLocalPassword("");
        setCurrentPassword("");
      } else {
        setValidationErrors((prev) => ({ ...prev, ...response.errors }));
      }
    }

    setSaving((prev) => ({ ...prev, loading: false }));
  };

  const deleteUser = async () => {
    const response = await destroy(`/api/v1/users/${id}`).catch(() =>
      setValidationErrors((prev) => ({ ...prev, deleting: true }))
    );

    if (response && response.success) {
      window.location.href = "/";
    } else {
      setValidationErrors((prev) => ({ ...prev, deleting: true }));
    }
  };

  return (
    <div className="d-flex flex-column mx-auto align-items-center p-3 edit-profile-content">
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
        <TalentProfilePicture src={localProfilePictureUrl} height={80} />
        <div className="ml-3 d-flex flex-column">
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
          <P2 text="JPG or PNG. Max 1MB" mode={theme.mode()} />
        </div>
        {uploadingFileS3 == "profile" && (
          <P2
            text="Uploading"
            mode={theme.mode()}
            className="ml-2 align-self-start"
          />
        )}
        {uploadingFileS3 != "profile" && uploaded["profile"] && (
          <P2
            text="Uploaded File"
            mode={theme.mode()}
            className="ml-2 align-self-start"
          />
        )}
      </div>
      <div className="d-flex flex-row w-100 flex-wrap justify-content-between mt-3">
        <TextInput
          title={"Username"}
          mode={theme.mode()}
          onChange={(e) => setLocalUsername(e.target.value)}
          value={localUsername}
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
          mode={theme.mode()}
          onChange={(e) => setLocalEmail(e.target.value)}
          value={localEmail}
          className="w-100"
          required={true}
          error={validationErrors?.email}
        />
        {validationErrors?.email && (
          <Caption className="text-danger" text="Email is already taken." />
        )}
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Current Password"}
          type="password"
          placeholder={"*********"}
          mode={theme.mode()}
          onChange={(e) => setCurrentPassword(e.target.value)}
          value={currentPassword}
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
          mode={theme.mode()}
          onChange={(e) => setLocalPassword(e.target.value)}
          value={localPassword}
          className="w-100"
          required={true}
          error={validationErrors?.newPassword}
        />
      </div>
      <Button
        onClick={() => updateUser()}
        type="primary-default"
        mode={theme.mode()}
        className="mt-3 w-100"
      >
        Change password
      </Button>
      <div className={`divider ${theme.mode()} my-3`}></div>
      <div className="d-flex flex-row w-100 justify-content-between my-3">
        <div className="d-flex flex-column w-100 flex-wrap">
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
        </div>
        <div>
          <Button
            onClick={() => deleteUser()}
            type="danger-default"
            mode={theme.mode()}
          >
            Delete Account
          </Button>
        </div>
      </div>
      <div className={"d-flex flex-row justify-content-start w-100"}>
        <LoadingButton
          onClick={() => updateUser()}
          type="primary-default"
          mode={theme.mode()}
          disabled={saving["loading"]}
          loading={saving["loading"]}
          success={saving["profile"]}
          className="text-black"
        >
          Save Profile
        </LoadingButton>
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

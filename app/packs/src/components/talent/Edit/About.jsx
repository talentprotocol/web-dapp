import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { FileInput } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";

import "@uppy/core/dist/style.css";
import "@uppy/file-input/dist/style.css";

import { getAuthToken } from "src/utils/requests";

import H5 from "src/components/design_system/typography/h5";
import P2 from "src/components/design_system/typography/p2";
import TalentProfilePicture from "../TalentProfilePicture";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import TagInput from "src/components/design_system/tag_input";
import Caption from "src/components/design_system/typography/caption";
import { ArrowRight } from "src/components/icons";
import LoadingButton from "src/components/button/LoadingButton";
import Divider from "src/components/design_system/other/Divider";

import cx from "classnames";

const uppyProfile = new Uppy({
  meta: { type: "avatar" },
  restrictions: {
    maxFileSize: 5120000,
    allowedFileTypes: [".jpg", ".png", ".jpeg"],
  },
  autoProceed: true,
});

const uppyBanner = new Uppy({
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

uppyBanner.use(AwsS3Multipart, {
  limit: 4,
  companionUrl: "/",
  companionHeaders: {
    "X-CSRF-Token": getAuthToken(),
  },
});

const About = (props) => {
  const {
    mode,
    changeTab,
    changeSharedState,
    mobile,
    saveProfile,
    publicButtonType,
    disablePublicButton,
    togglePublicProfile,
    trackChanges,
  } = props;
  const [errorTracking, setErrorTracking] = useState({});
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [uploaded, setUploaded] = useState({ banner: false, profile: false });
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });

  useEffect(() => {
    uppyProfile.on("upload-success", (file, response) => {
      changeSharedState((prev) => ({
        ...prev,
        profilePictureUrl: response.uploadURL,
        talent: {
          ...prev.talent,
          profile_picture_data: {
            id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
            storage: "cache",
            metadata: {
              size: file.size,
              filename: file.name,
              mime_type: file.type,
            },
          },
        },
      }));

      setUploaded((prev) => ({ ...prev, profile: true }));
      setUploadingFileS3("");
    });
    uppyProfile.on("upload", () => {
      setUploadingFileS3("profile");
      trackChanges(true);
      setErrorTracking((prev) => ({ ...prev, profilePictureSize: false }));
    });
    uppyProfile.on("restriction-failed", () => {
      uppyProfile.reset();
      setErrorTracking((prev) => ({ ...prev, profilePictureSize: true }));
    });

    uppyBanner.on("restriction-failed", () => {
      uppyBanner.reset();
      setErrorTracking((prev) => ({ ...prev, bannerSize: true }));
    });
    uppyBanner.on("upload-success", (file, response) => {
      changeSharedState((prev) => ({
        ...prev,
        bannerUrl: response.uploadURL,
        talent: {
          ...prev.talent,
          banner_data: {
            id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
            storage: "cache",
            metadata: {
              size: file.size,
              filename: file.name,
              mime_type: file.type,
            },
          },
        },
      }));

      setUploaded((prev) => ({ ...prev, banner: true }));
      setUploadingFileS3("");
    });
    uppyBanner.on("upload", () => {
      setErrorTracking((prev) => ({ ...prev, bannerSize: false }));
      setUploadingFileS3("banner");
      trackChanges(true);
    });
  }, []);

  const validateWebsite = (attribute, value) => {
    if (attribute != "website") {
      return;
    }

    if (
      value?.includes("http://") ||
      value?.includes("https://") ||
      value == ""
    ) {
      setErrorTracking((prev) => ({ ...prev, [attribute]: false }));
    } else {
      setErrorTracking((prev) => ({ ...prev, [attribute]: true }));
    }
  };

  const changeTalentAttribute = (attribute, value) => {
    trackChanges(true);
    validateWebsite(attribute, value);

    changeSharedState((prev) => ({
      ...prev,
      talent: {
        ...prev.talent,
        profile: {
          ...prev.talent.profile,
          [attribute]: value,
        },
      },
    }));
  };

  const changeUserAttribute = (attribute, value) => {
    trackChanges(true);
    changeSharedState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [attribute]: value,
      },
    }));
  };

  const changeTags = (tags) => {
    trackChanges(true);
    changeSharedState((prev) => ({
      ...prev,
      tags,
    }));
  };

  const onProfileSave = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await saveProfile();
    setSaving((prev) => ({ ...prev, loading: false, profile: true }));
    trackChanges(false);
  };

  const onTogglePublic = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await togglePublicProfile();
    setSaving((prev) => ({ ...prev, loading: false, public: true }));
  };

  const cannotSaveProfile =
    !props.talent.profile.headline || !props.talent.profile.occupation || !props.profilePictureUrl;

  return (
    <>
      <H5
        className="w-100 text-left"
        mode={mode}
        text="Personal Information"
        bold
      />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Let's start with the basics"
      />
      <div className="d-flex flex-row w-100 align-items-center mt-4">
        <TalentProfilePicture src={props.profilePictureUrl} height={80} />
        <div className="ml-4 d-flex flex-column">
          <div className="d-flex align-items-center">
            <FileInput
              uppy={uppyProfile}
              pretty
              inputName="files[]"
              locale={{
                strings: {
                  chooseFiles: "Choose Profile Picture *",
                },
              }}
            />
            {uploadingFileS3 == "profile" && (
              <P2 text="Uploading" className="ml-2 text-black" bold />
            )}
            {uploadingFileS3 != "profile" && uploaded["profile"] && (
              <P2 text="Uploaded File" className="ml-2 text-black" bold />
            )}
            {errorTracking?.profilePictureSize && (
              <P2 text="File is too large." className="ml-2 text-danger" bold />
            )}
          </div>
          <P2
            className="mt-2"
            text="Add a portrait here and get your face easily recognized by your network. JPG or PNG, max 5MB. "
          />
        </div>
      </div>
      <div className="d-flex flex-row flex-wrap w-100 align-items-center mt-4">
        <TalentProfilePicture
          src={props.bannerUrl}
          straight
          className="image-fit align-self-start"
          height={80}
          width={270}
        />
        <div className={cx("d-flex flex-column", mobile ? "mt-4" : "ml-4")}>
          <div className="d-flex align-items-center">
            <FileInput
              uppy={uppyBanner}
              pretty
              inputName="banners[]"
              locale={{
                strings: {
                  chooseFiles: "Choose Profile Banner",
                },
              }}
            />
            {uploadingFileS3 == "banner" && (
              <P2 text="Uploading" className="ml-2 text-black" bold />
            )}
            {uploadingFileS3 != "banner" && uploaded["banner"] && (
              <P2 text="Uploaded File" className="ml-2 text-black" bold />
            )}
            {errorTracking?.bannerSize && (
              <P2 text="File is too large." className="ml-2 text-danger" bold />
            )}
          </div>

          <P2
            className="mt-2"
            text="JPG or PNG. Recomended 1240x356. Max 5MB"
          />
        </div>
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Display Name"}
          mode={mode}
          shortCaption="The name that we will generally use"
          onChange={(e) => changeUserAttribute("display_name", e.target.value)}
          value={props.user.display_name || ""}
          className={mobile ? "w-100" : "w-50 pr-2"}
        />
        <TextInput
          title={"Location"}
          mode={mode}
          onChange={(e) => changeTalentAttribute("location", e.target.value)}
          value={props.talent.profile.location || ""}
          className={mobile ? "w-100" : "w-50 pl-2"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Occupation"}
          mode={mode}
          shortCaption="We know you are a lot of things, but let us know your main occupation"
          onChange={(e) => changeTalentAttribute("occupation", e.target.value)}
          value={props.talent.profile.occupation || ""}
          className="w-100"
          required={true}
        />
      </div>
      <div className="d-flex flex-column w-100 justify-content-between mt-4">
        <TagInput
          label={"Tags"}
          mode={mode}
          onTagChange={(newTags) => changeTags(newTags)}
          tags={props.tags}
          className="w-100"
        />
        <p className="short-caption">
          Add keywords that define you. Skills, industries, roles, passions,
          hobbies. Press Enter to create a tag. Do not use commas or dots in the
          tags
        </p>
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextArea
          title={"Intro"}
          mode={mode}
          shortCaption="Tell supporters where you come from, what you do, and how you got to be who you are today."
          onChange={(e) => changeTalentAttribute("headline", e.target.value)}
          value={props.talent.profile.headline || ""}
          className="w-100"
          maxLength="240"
          required={true}
          rows={3}
        />
      </div>
      <Divider className="my-5" />
      <H5 className="w-100 text-left" text="Social Profiles" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Add links to where supporters can find out more about you"
      />
      <div className="d-flex flex-column w-100 justify-content-between mt-4">
        <TextInput
          title={"Website"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeTalentAttribute("website", e.target.value)}
          value={props.talent.profile.website || ""}
          className="w-100"
        />
        {errorTracking["website"] && (
          <P2
            className="text-danger"
            text="Please use a valid URL, it needs to include http:// or https://"
          />
        )}
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Linkedin"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeTalentAttribute("linkedin", e.target.value)}
          value={props.talent.profile.linkedin || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Twitter"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeTalentAttribute("twitter", e.target.value)}
          value={props.talent.profile.twitter || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Telegram"}
          mode={mode}
          placeholder={"@"}
          onChange={(e) => changeTalentAttribute("telegram", e.target.value)}
          value={props.talent.profile.telegram || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Discord"}
          mode={mode}
          placeholder={"#"}
          onChange={(e) => changeTalentAttribute("discord", e.target.value)}
          value={props.talent.profile.discord || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Github"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeTalentAttribute("github", e.target.value)}
          value={props.talent.profile.github || ""}
          className="w-100"
        />
      </div>
      {mobile && (
        <div className="d-flex flex-column align-items-end w-100 my-3">
          <Caption text="NEXT" />
          <div className="text-grey cursor-pointer" onClick={changeTab}>
            Highlights <ArrowRight color="currentColor" />
          </div>
        </div>
      )}
      <Divider className="my-4" />
      <div
        className={`d-flex flex-row ${
          mobile ? "justify-content-between" : ""
        } w-100 pb-4`}
      >
        {mobile && (
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
        )}
        <LoadingButton
          onClick={() => onProfileSave()}
          type="primary-default"
          mode={mode}
          disabled={cannotSaveProfile || saving["loading"]}
          loading={saving["loading"]}
          success={saving["profile"]}
        >
          Save Profile
        </LoadingButton>
      </div>
    </>
  );
};

export default About;

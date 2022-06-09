import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { FileInput } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";

import "@uppy/core/dist/style.css";
import "@uppy/file-input/dist/style.css";

import { getAuthToken } from "src/utils/requests";
import { patch } from "src/utils/requests";

import { H5, P2, Caption } from "src/components/design_system/typography";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import TextInput from "src/components/design_system/fields/textinput";
import TextArea from "src/components/design_system/fields/textarea";
import TagInput from "src/components/design_system/tag_input";
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

const About = ({
  id,
  profilePictureUrl,
  bannerUrl,
  investor,
  displayName,
  tags,
  changeTab,
  mobile,
  trackChanges,
  changeSharedState,
}) => {
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
        investor: {
          ...prev.investor,
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
        investor: {
          ...prev.investor,
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

  const changeInvestorAttribute = (attribute, value) => {
    trackChanges(true);
    validateWebsite(attribute, value);

    changeSharedState((prev) => ({
      ...prev,
      investor: {
        ...prev.investor,
        profile: {
          ...prev.investor.profile,
          [attribute]: value,
        },
      },
    }));
  };

  const changeUserAttribute = (attribute, value) => {
    trackChanges(true);
    changeSharedState((prev) => ({ ...prev, [attribute]: value }));
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

    const response = await patch(`/api/v1/users/${id}`, {
      display_name: displayName,
      tags: tags,
      investor: investor,
    }).catch(() => {
      return false;
    });

    setSaving((prev) => ({ ...prev, loading: false, profile: true }));
    trackChanges(false);
  };

  const cannotSaveProfile =
    !investor.profile.headline || !investor.profile.occupation || !profilePictureUrl;

  return (
    <>
      <H5 className="w-100 text-left" text="Personal Information" bold />
      <P2 className="w-100 text-left" text="Let's start with the basics" />
      <div className="d-flex flex-row w-100 align-items-center mt-4">
        <TalentProfilePicture src={profilePictureUrl} height={80} />
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
          src={bannerUrl}
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
          shortCaption="The name that we will generally use"
          onChange={(e) => changeUserAttribute("displayName", e.target.value)}
          value={displayName || ""}
          className={mobile ? "w-100" : "w-50 pr-2"}
        />
        <TextInput
          title={"Location"}
          onChange={(e) => changeInvestorAttribute("location", e.target.value)}
          value={investor.profile.location || ""}
          className={mobile ? "w-100" : "w-50 pl-2"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4 flex-wrap">
        <TextInput
          title={"Occupation"}
          shortCaption="We know you are a lot of things, but let us know your main occupation"
          onChange={(e) =>
            changeInvestorAttribute("occupation", e.target.value)
          }
          value={investor.profile.occupation || ""}
          className="w-100"
          required={true}
        />
      </div>
      <div className="d-flex flex-column w-100 justify-content-between mt-4">
        <TagInput
          label={"Tags"}
          onTagChange={(newTags) => changeTags(newTags)}
          tags={tags}
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
          shortCaption="Tell supporters where you come from, what you do, and how you got to be who you are today."
          onChange={(e) => changeInvestorAttribute("headline", e.target.value)}
          value={investor.profile.headline || ""}
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
        text="Add links to where supporters can find out more about you"
      />
      <div className="d-flex flex-column w-100 justify-content-between mt-4">
        <TextInput
          title={"Website"}
          placeholder={"https://"}
          onChange={(e) => changeInvestorAttribute("website", e.target.value)}
          value={investor.profile.website || ""}
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
          placeholder={"https://"}
          onChange={(e) => changeInvestorAttribute("linkedin", e.target.value)}
          value={investor.profile.linkedin || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Twitter"}
          placeholder={"https://"}
          onChange={(e) => changeInvestorAttribute("twitter", e.target.value)}
          value={investor.profile.twitter || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Telegram"}
          placeholder={"@"}
          onChange={(e) => changeInvestorAttribute("telegram", e.target.value)}
          value={investor.profile.telegram || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Discord"}
          placeholder={"#"}
          onChange={(e) => changeInvestorAttribute("discord", e.target.value)}
          value={investor.profile.discord || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-4">
        <TextInput
          title={"Github"}
          placeholder={"https://"}
          onChange={(e) => changeInvestorAttribute("github", e.target.value)}
          value={investor.profile.github || ""}
          className="w-100"
        />
      </div>
      {mobile && (
        <div className="d-flex flex-column align-items-end w-100 my-3">
          <Caption text="NEXT" />
          <div
            className="text-grey cursor-pointer"
            onClick={() => changeTab("Invites")}
          >
            Invites <ArrowRight color="currentColor" />
          </div>
        </div>
      )}
      <Divider className="my-4" />
      <div
        className={`d-flex flex-row ${
          mobile ? "justify-content-between" : ""
        } w-100 pb-4`}
      >
        <LoadingButton
          onClick={() => onProfileSave()}
          type="primary-default"
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

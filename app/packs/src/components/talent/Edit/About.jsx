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

const setupUppy = () => {
  const uppyProfile = new Uppy({
    meta: { type: "avatar" },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
  });

  const uppyBanner = new Uppy({
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

  uppyBanner.use(AwsS3Multipart, {
    limit: 4,
    companionUrl: "/",
    companionHeaders: {
      "X-CSRF-Token": getAuthToken(),
    },
  });

  return { uppyBanner, uppyProfile };
};

const About = ({ mode, changeTab, changeSharedState, ...props }) => {
  const {
    mobile,
    saveProfile,
    publicButtonType,
    disablePublicButton,
    togglePublicProfile,
  } = props;
  const [errorTracking, setErrorTracking] = useState({});
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [saving, setSaving] = useState({
    loading: false,
    profile: false,
    public: false,
  });

  const { uppyProfile, uppyBanner } = setupUppy();

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

      setUploadingFileS3("");
    });
    uppyProfile.on("upload", () => {
      setUploadingFileS3("profile");
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

      setUploadingFileS3("");
    });
    uppyBanner.on("upload", () => {
      setUploadingFileS3("banner");
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
    changeSharedState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [attribute]: value,
      },
    }));
  };

  const changeTags = (tags) => {
    changeSharedState((prev) => ({
      ...prev,
      secondary_tags: tags,
    }));
  };

  const onProfileSave = async () => {
    setSaving((prev) => ({ ...prev, loading: true }));
    await saveProfile();
    setSaving((prev) => ({ ...prev, loading: false, profile: true }));
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
          <P2 text="JPG or PNG. Max 1MB" mode={mode} />
        </div>
        {uploadingFileS3 == "profile" && (
          <P2 text="Uploading" mode={mode} className="ml-2 align-self-start" />
        )}
        {uploadingFileS3 != "profile" &&
          props.talent.profile_picture_data !== null && (
            <P2
              text="Uploaded File"
              mode={mode}
              className="ml-2 align-self-start"
            />
          )}
      </div>
      <div className="d-flex flex-row w-100 align-items-center mt-4">
        <TalentProfilePicture
          src={props.bannerUrl}
          straight
          className={"w-50"}
          height={80}
        />
        <div className="ml-3 d-flex flex-column">
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
          <P2 text="JPG or PNG. Recomended 1240x356. Max 1MB" mode={mode} />
        </div>
        {uploadingFileS3 == "banner" && (
          <P2 text="Uploading" mode={mode} className="ml-2 align-self-start" />
        )}
        {uploadingFileS3 != "banner" && props.talent.banner_data !== null && (
          <P2
            text="Uploaded File"
            mode={mode}
            className="ml-2 align-self-start w-100"
          />
        )}
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
      <div className="d-flex flex-row w-100 justify-content-between mt-3 flex-wrap">
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
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TagInput
          label={"Tags"}
          mode={mode}
          caption="Press Enter to create a tag. Do not use commas or dots in the tags"
          onTagChange={(newTags) => changeTags(newTags)}
          tags={props.secondary_tags}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Bio"}
          mode={mode}
          shortCaption="Brief description for your profile"
          onChange={(e) => changeTalentAttribute("headline", e.target.value)}
          value={props.talent.profile.headline || ""}
          className="w-100"
          maxLength="240"
          required={true}
        />
      </div>
      <div className={`divider ${mode} my-3`}></div>
      <H5 className="w-100 text-left" mode={mode} text="Social Profiles" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Add links to where supporters can find out more about you"
      />
      <div className="d-flex flex-column w-100 justify-content-between mt-3">
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
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Linkedin"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeTalentAttribute("linkedin", e.target.value)}
          value={props.talent.profile.linkedin || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Twitter"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeTalentAttribute("twitter", e.target.value)}
          value={props.talent.profile.twitter || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Telegram"}
          mode={mode}
          placeholder={"@"}
          onChange={(e) => changeTalentAttribute("telegram", e.target.value)}
          value={props.talent.profile.telegram || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Discord"}
          mode={mode}
          placeholder={"#"}
          onChange={(e) => changeTalentAttribute("discord", e.target.value)}
          value={props.talent.profile.discord || ""}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between my-3">
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
      <div className={`divider ${mode} my-3`}></div>
      <div
        className={`d-flex flex-row ${
          mobile ? "justify-content-between" : "justify-content-end"
        } w-100`}
      >
        {mobile && (
          <LoadingButton
            onClick={() => onTogglePublic()}
            type={publicButtonType}
            disabled={disablePublicButton}
            mode={mode}
            disabled={saving["loading"]}
            loading={saving["loading"]}
            success={saving["public"]}
            className="ml-auto mr-3"
          >
            {props.talent.public ? "Public" : "Publish Profile"}
          </LoadingButton>
        )}
        <LoadingButton
          onClick={() => onProfileSave()}
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

export default About;

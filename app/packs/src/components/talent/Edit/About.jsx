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

const About = ({ railsContext, mode, ...props }) => {
  const { profilePictureUrl, bannerUrl, mobile, user, talent, secondary_tags } =
    props;
  const [aboutInfo, setAboutInfo] = useState({
    display_name: user.display_name || "",
    location: talent.profile.location || "",
    occupation: talent.profile.occupation || "",
    secondary_tags: secondary_tags,
    headline: talent.profile.headline || "",
    website: talent.profile.website || "",
    uploadedFileData: null,
    uploadedBannerData: null,
    fileUrl: "",
    bannerUrl: "",
    github: talent.profile.github || "",
    linkedin: talent.profile.linkedin || "",
    twitter: talent.profile.twitter || "",
    instagram: talent.profile.instagram || "",
    telegram: talent.profile.telegram || "",
    discord: talent.profile.discord || "",
  });
  const [uploadingFileS3, setUploadingFileS3] = useState(false);

  const { uppyProfile, uppyBanner } = setupUppy();

  useEffect(() => {
    uppyProfile.on("upload-success", (file, response) => {
      changeAttribute("fileUrl", response.uploadURL);

      changeAttribute("uploadedFileData", {
        id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
        storage: "cache",
        metadata: {
          size: file.size,
          filename: file.name,
          mime_type: file.type,
        },
      });
      setUploadingFileS3("");
    });
    uppyProfile.on("upload", () => {
      setUploadingFileS3("profile");
    });
    uppyBanner.on("upload-success", (file, response) => {
      changeAttribute("bannerUrl", response.uploadURL);

      changeAttribute("uploadedBannerData", {
        id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
        storage: "cache",
        metadata: {
          size: file.size,
          filename: file.name,
          mime_type: file.type,
        },
      });
      setUploadingFileS3("");
    });
    uppyBanner.on("upload", () => {
      setUploadingFileS3("banner");
    });
  }, []);

  const changeAttribute = (attribute, value) => {
    validateWebsite(attribute, value);

    setAboutInfo((prevInfo) => ({ ...prevInfo, [attribute]: value }));
  };

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
        {(aboutInfo["fileUrl"] != "" || profilePictureUrl) && (
          <TalentProfilePicture
            src={
              aboutInfo["fileUrl"] != ""
                ? aboutInfo["fileUrl"]
                : profilePictureUrl
            }
            height={80}
          />
        )}
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
          aboutInfo["uploadedFileData"] !== null && (
            <P2
              text="Uploaded File"
              mode={mode}
              className="ml-2 align-self-start"
            />
          )}
      </div>
      <div className="d-flex flex-row w-100 align-items-center mt-4">
        {(aboutInfo["bannerUrl"] != "" || bannerUrl) && (
          <TalentProfilePicture
            src={
              aboutInfo["bannerUrl"] != "" ? aboutInfo["bannerUrl"] : bannerUrl
            }
            straight
            className={"w-50"}
            height={80}
          />
        )}
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
        {uploadingFileS3 != "banner" &&
          aboutInfo["uploadedBannerData"] !== null && (
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
          onChange={(e) => changeAttribute("display_name", e.target.value)}
          value={aboutInfo["display_name"]}
          className={mobile ? "w-100 px-3" : "w-50 pr-2"}
        />
        <TextInput
          title={"Location"}
          mode={mode}
          onChange={(e) => changeAttribute("location", e.target.value)}
          value={aboutInfo["location"]}
          className={mobile ? "w-100 px-3" : "w-50 pl-2"}
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3 flex-wrap">
        <TextInput
          title={"Occupation"}
          mode={mode}
          shortCaption="We know you are a lot of things, but let us know your main occupation"
          onChange={(e) => changeAttribute("occupation", e.target.value)}
          value={aboutInfo["occupation"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TagInput
          label={"Tags"}
          mode={mode}
          caption="Press Enter to create a tag. Do not use commas or dots in the tags"
          onTagChange={(newTags) => changeAttribute("secondary_tags", newTags)}
          tags={aboutInfo["secondary_tags"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextArea
          title={"Bio"}
          mode={mode}
          shortCaption="Brief description for your profile"
          onChange={(e) => changeAttribute("headline", e.target.value)}
          value={aboutInfo["headline"]}
          className="w-100"
          maxLength="240"
        />
      </div>
      <div className={`divider ${mode} my-3`}></div>
      <H5 className="w-100 text-left" mode={mode} text="Social Profiles" bold />
      <P2
        className="w-100 text-left"
        mode={mode}
        text="Add links to where supporters can find out more about you"
      />
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Website"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeAttribute("website", e.target.value)}
          value={aboutInfo["website"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Linkedin"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeAttribute("linkedin", e.target.value)}
          value={aboutInfo["linkedin"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Twitter"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeAttribute("twitter", e.target.value)}
          value={aboutInfo["twitter"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Telegram"}
          mode={mode}
          placeholder={"@"}
          onChange={(e) => changeAttribute("telegram", e.target.value)}
          value={aboutInfo["telegram"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between mt-3">
        <TextInput
          title={"Discord"}
          mode={mode}
          placeholder={"#"}
          onChange={(e) => changeAttribute("discord", e.target.value)}
          value={aboutInfo["discord"]}
          className="w-100"
        />
      </div>
      <div className="d-flex flex-row w-100 justify-content-between my-3">
        <TextInput
          title={"Github"}
          mode={mode}
          placeholder={"https://"}
          onChange={(e) => changeAttribute("github", e.target.value)}
          value={aboutInfo["github"]}
          className="w-100"
        />
      </div>
    </>
  );
};

export default About;

import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";

import { patch, getAuthToken } from "src/utils/requests";

import TalentProfilePicture from "../../TalentProfilePicture";
import Button from "../../../button";
import { useWindowDimensionsHook } from "src/utils/window";

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

const About = ({
  close,
  talent,
  user,
  primary_tag,
  secondary_tags,
  updateSharedState,
  profileIsComplete,
  profilePictureUrl,
  bannerUrl,
}) => {
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [errorTracking, setErrorTracking] = useState({});
  const { height, width } = useWindowDimensionsHook();
  const [aboutInfo, setAboutInfo] = useState({
    username: user.username || "",
    display_name: user.display_name || "",
    pronouns: talent.profile.pronouns || "",
    location: talent.profile.location || "",
    occupation: talent.profile.occupation || "",
    primary_tag: primary_tag || "",
    secondary_tags: secondary_tags.join(", "),
    headline: talent.profile.headline || "",
    website: talent.profile.website || "",
    wallet_address: talent.profile.wallet_address || "",
    disable_messages: talent.disable_messages || "",
    public_profile: talent.public || "",
    video: talent.profile.video || "",
    uploadedFileData: null,
    uploadedBannerData: null,
    fileUrl: "",
    bannerUrl: "",
  });

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
      console.log("HEHRE");
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const response = await patch(`/api/v1/talent/${talent.id}`, {
      talent: {
        username: aboutInfo["username"],
        display_name: aboutInfo["display_name"],
        profile_picture: aboutInfo["uploadedFileData"],
        banner: aboutInfo["uploadedBannerData"],
        public: aboutInfo["public_profile"],
        primary_tag: aboutInfo["primary_tag"],
        secondary_tags: aboutInfo["secondary_tags"],
        disable_messages: aboutInfo["disable_messages"],
        profile: {
          pronouns: aboutInfo["pronouns"],
          occupation: aboutInfo["occupation"],
          location: aboutInfo["location"],
          headline: aboutInfo["headline"],
          website: aboutInfo["website"],
          wallet_address: aboutInfo["wallet_address"],
          video: aboutInfo["video"],
        },
      },
    }).catch(() => {
      setError(true);
      setSaving(false);
    });

    if (response) {
      if (response.error) {
        setError(true);
      } else {
        updateSharedState((prevState) => ({
          ...prevState,
          talent: {
            ...prevState.talent,
            public: aboutInfo["public_profile"],
            disable_messages: aboutInfo["disable_messages"],
            profile: {
              ...prevState.talent.profile,
              pronouns: aboutInfo["pronouns"],
              location: aboutInfo["location"],
              occupation: aboutInfo["occupation"],
              headline: aboutInfo["headline"],
              website: aboutInfo["website"],
              wallet_address: aboutInfo["wallet_address"],
              video: aboutInfo["video"],
            },
          },
          profilePictureUrl:
            aboutInfo["fileUrl"] || prevState.profilePictureUrl,
          bannerUrl: aboutInfo["bannerUrl"] || prevState.bannerUrl,
          user: {
            ...prevState.user,
            username: aboutInfo["username"],
            display_name: aboutInfo["display_name"],
          },
          primary_tag: aboutInfo["primary_tag"],
          secondary_tags: aboutInfo["secondary_tags"]
            .split(",")
            .map((t) => t.trim()),
        }));
      }
    }
    setSaving(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    close();
  };

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

  const validForm = () => {
    let valid = true;

    Object.keys(errorTracking).forEach((error) => {
      valid = !errorTracking[error] && valid;
    });

    return valid;
  };

  return (
    <div className="col-md-8 mx-auto d-flex flex-column my-3">
      <h4>About</h4>
      <form>
        <div className="form-group">
          <label className="mr-1">Profile picture *</label>
          <div className="d-flex flex-column">
            <div className="h-100 d-flex flex-row justify-content-center mb-3">
              {(aboutInfo["fileUrl"] != "" || profilePictureUrl) && (
                <TalentProfilePicture
                  src={
                    aboutInfo["fileUrl"] != ""
                      ? aboutInfo["fileUrl"]
                      : profilePictureUrl
                  }
                  height={width > 992 ? "50%" : "100%"}
                  straight
                  className={"rounded mx-auto"}
                />
              )}
            </div>
            {uploadingFileS3 == "profile" && (
              <p>
                <FontAwesomeIcon icon={faSpinner} spin /> Uploading...
              </p>
            )}
            {uploadingFileS3 != "profile" &&
              aboutInfo["uploadedFileData"] !== null && <p>Uploaded file. </p>}
            <div className="w-100">
              {uploadingFileS3 != "profile" &&
                aboutInfo["uploadedFileData"] === null && (
                  <DragDrop
                    uppy={uppyProfile}
                    width="100%"
                    height="100%"
                    locale={{
                      strings: {
                        dropHereOr: "Drop here or %{browse}",
                        browse: "browse",
                      },
                    }}
                  />
                )}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label className="mr-1">Banner</label>
          <div className="d-flex flex-column">
            <div className="h-100 d-flex flex-row justify-content-center mb-3">
              {(aboutInfo["bannerUrl"] != "" || bannerUrl) && (
                <TalentProfilePicture
                  src={
                    aboutInfo["bannerUrl"] != ""
                      ? aboutInfo["bannerUrl"]
                      : bannerUrl
                  }
                  height={width > 992 ? "50%" : "100%"}
                  straight
                  className={"rounded mx-auto"}
                />
              )}
            </div>

            {uploadingFileS3 == "banner" && (
              <p>
                <FontAwesomeIcon icon={faSpinner} spin /> Uploading...
              </p>
            )}
            {uploadingFileS3 != "banner" &&
              aboutInfo["uploadedBannerData"] !== null && (
                <p>Uploaded banner. </p>
              )}
            <div className="w-100">
              {uploadingFileS3 != "banner" &&
                aboutInfo["uploadedBannerData"] === null && (
                  <DragDrop
                    uppy={uppyBanner}
                    width="100%"
                    height="100%"
                    locale={{
                      strings: {
                        dropHereOr: "Drop here or %{browse}",
                        browse: "browse",
                      },
                    }}
                  />
                )}
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            className="form-control"
            disabled
            placeholder="talentprotocol"
            value={aboutInfo["username"]}
            aria-describedby="username_help"
            onChange={(e) => changeAttribute("username", e.target.value)}
          />
          <small id="username_help" className="form-text text-muted">
            Only small letters allowed.
          </small>
        </div>
        <div className="form-group">
          <div className="d-flex flex-row justify-content-between">
            <label htmlFor="display_name">Display Name</label>
            <label htmlFor="display_name">
              <small className="text-muted">
                {aboutInfo["display_name"]?.length || 0} of 25
              </small>
            </label>
          </div>
          <input
            id="display_name"
            className="form-control"
            maxLength="25"
            placeholder="The name that we will generally use"
            onChange={(e) => changeAttribute("display_name", e.target.value)}
            value={aboutInfo["display_name"]}
          />
        </div>
        <div className="form-group">
          <div className="d-flex flex-row justify-content-between">
            <label htmlFor="occupation">Occupation *</label>
            <label htmlFor="occupation">
              <small className="text-muted">
                {aboutInfo["occupation"]?.length || 0} of 25
              </small>
            </label>
          </div>
          <input
            id="occupation"
            className="form-control"
            maxLength="25"
            placeholder="Your current occupation"
            onChange={(e) => changeAttribute("occupation", e.target.value)}
            value={aboutInfo["occupation"]}
          />
        </div>
        <div className="form-group">
          <div className="d-flex flex-row justify-content-between">
            <label htmlFor="location">Location</label>
            <label htmlFor="location">
              <small className="text-muted">
                {aboutInfo["location"]?.length || 0} of 25
              </small>
            </label>
          </div>
          <input
            id="location"
            className="form-control"
            placeholder="Nomad, Lisbon"
            maxLength={25}
            value={aboutInfo["location"]}
            onChange={(e) => changeAttribute("location", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            className="form-control"
            value={aboutInfo["secondary_tags"]}
            placeholder="Skills, roles, interests"
            onChange={(e) => changeAttribute("secondary_tags", e.target.value)}
          />
        </div>
        <div className="form-group">
          <div className="d-flex flex-row justify-content-between">
            <label htmlFor="headline">Bio *</label>
            <label htmlFor="headline">
              <small className="text-muted">
                {aboutInfo["headline"]?.length || 0} of 240
              </small>
            </label>
          </div>
          <textarea
            rows="5"
            id="headline"
            maxLength="240"
            className="form-control"
            value={aboutInfo["headline"]}
            placeholder="Short description of what you are about"
            onChange={(e) => changeAttribute("headline", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            className={`form-control ${
              errorTracking["website"] ? "border-danger" : ""
            }`}
            value={aboutInfo["website"]}
            placeholder="The main url that represents you online"
            onChange={(e) => changeAttribute("website", e.target.value)}
          />
          <small id="website_help" className="form-text text-muted">
            The link must include "http://" or "https://"
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="video">Video</label>
          <input
            id="video"
            className="form-control"
            value={aboutInfo["video"]}
            aria-describedby="video_help"
            placeholder="A video that represents you"
            onChange={(e) => changeAttribute("video", e.target.value)}
          />
          <small id="video_help" className="form-text text-muted">
            Currently only youtube links are supported.
          </small>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="disable_messages"
            disabled
            className="form-check-input"
            checked={aboutInfo["disable_messages"]}
            onChange={(e) =>
              changeAttribute("disable_messages", e.target.checked)
            }
          />
          <label className="form-check-label" htmlFor="disable_messages">
            Disable messages
          </label>
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="public_profile"
            className="form-check-input"
            disabled={!profileIsComplete}
            checked={aboutInfo["public_profile"]}
            onChange={(e) =>
              changeAttribute("public_profile", e.target.checked)
            }
          />
          <label className="form-check-label" htmlFor="public_profile">
            Make profile public.{" "}
            {!profileIsComplete && (
              <span className="text-danger">
                You must complete your profile before you can make your profile
                public
              </span>
            )}
          </label>
        </div>
        {error && (
          <>
            <p className="text-danger">
              We had some trouble updating your profile. Reach out to us if this
              persists.
            </p>
          </>
        )}
        <p className="my-3">* Field is required.</p>
        <div className="mb-2 d-flex flex-row-reverse align-items-end justify-content-between">
          <button
            disabled={saving || !validForm()}
            onClick={handleSave}
            className="btn btn-primary talent-button"
          >
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Saving
              </>
            ) : (
              "Save"
            )}
          </button>
          <Button type="secondary" text="Cancel" onClick={handleCancel} />
        </div>
      </form>
    </div>
  );
};

export default About;

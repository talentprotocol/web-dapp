import React, { useState, useEffect, useContext } from "react";
import { post, patch, destroy } from "src/utils/requests";

import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useWindowDimensionsHook } from "../../utils/window";
import TalentProfilePicture from "./TalentProfilePicture";

import StakeModal from "../token/StakeModal";
import UserTags from "./UserTags";

import Overview from "./Show/Overview";
import Timeline from "./Show/Timeline";
import Supporters from "./Show/Supporters";
import Supporting from "src/components/supporters/show/Supporting";

import Roadmap from "./Show/Roadmap";
import Perks from "./Show/Perks";
import SimpleTokenDetails from "./Show/SimpleTokenDetails";
import SocialRow from "./Show/SocialRow";

import Button from "src/components/design_system/button";
import { Chat } from "src/components/icons";
import { H2, H5, P3 } from "src/components/design_system/typography";
import Tooltip from "src/components/design_system/tooltip";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import cx from "classnames";

const TalentShow = ({
  admin,
  talent,
  token,
  perks,
  milestones,
  currentUserId,
  tokenLive,
  user,
  profilePictureUrl,
  bannerUrl,
  tags,
  careerGoal,
  goals,
  posts,
  isFollowing,
  railsContext,
  isCurrentUserImpersonated,
}) => {
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);

  const talentIsFromCurrentUser = talent.user_id == currentUserId;
  const publicPageViewer = !currentUserId;
  const [pageInDisplay, setPageInDisplay] = useState("overview");
  const [show, setShow] = useState(false);
  const [changingFollow, setChangingFollow] = useState(false);
  const { mobile, width } = useWindowDimensionsHook();
  const [sharedState, setSharedState] = useState({
    admin,
    talent,
    token,
    perks,
    milestones,
    currentUserId,
    tokenLive,
    bannerUrl,
    user,
    profilePictureUrl,
    tags,
    isFollowing,
    careerGoal,
    goals,
    posts,
  });
  const theme = useContext(ThemeContext);

  const ticker = () =>
    sharedState.token.ticker ? `${sharedState.token.ticker}` : "";
  const displayName = ({ withLink }) => {
    if (sharedState.talent.profile.website && withLink) {
      return (
        <a href={sharedState.talent.profile.website} className="text-reset">
          {sharedState.user.display_name || sharedState.user.username}
        </a>
      );
    }
    return sharedState.user.display_name || sharedState.user.username;
  };

  const toggleWatchlist = async (e) => {
    e.preventDefault();

    setChangingFollow(true);
    if (sharedState.isFollowing) {
      const response = await destroy(
        `/api/v1/follows?user_id=${user.id}`
      ).catch(() => setChangingFollow(false));

      if (response.success) {
        setSharedState((prev) => ({
          ...prev,
          isFollowing: false,
        }));
      }
    } else {
      const response = await post(`/api/v1/follows`, {
        user_id: user.id,
      }).catch(() => setChangingFollow(false));

      if (response.success) {
        setSharedState((prev) => ({
          ...prev,
          isFollowing: true,
        }));
      }
    }
    setChangingFollow(false);
  };

  const approveUser = async () => {
    const params = {
      user: {
        id: sharedState.user.id,
        profile_type: "approved",
      },
    };

    const response = await patch(
      `/api/v1/talent/${sharedState.talent.id}`,
      params
    ).catch(() => {
      return false;
    });

    if (response && !response.error) {
      setSharedState((prev) => ({
        ...prev,
        user: { ...prev.user, profile_type: "approved" },
      }));

      return true;
    }
  };

  const changeTab = (tab) => {
    window.history.pushState({}, document.title, `${url.pathname}?tab=${tab}`);
    setPageInDisplay(tab);
  };

  useEffect(() => {
    if (searchParams.get("tab")) {
      setPageInDisplay(searchParams.get("tab"));
    } else {
      window.history.replaceState(
        {},
        document.title,
        `${url.pathname}?tab=overview`
      );
    }
  }, [searchParams]);

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(document.location.search);
    if (document.location.search !== "") {
      setPageInDisplay(params.get("tab"));
    }
  });

  const copyLinkToProfile = () => {
    navigator.clipboard.writeText(
      window.location.origin + window.location.pathname
    );
  };

  const actionButtons = () => (
    <div className="d-flex flex-row flex-wrap flex-lg-nowrap justify-content-center justify-content-lg-start align-items-center mt-4 mt-lg-5 lg-w-100 lg-width-reset">
      {sharedState.admin &&
      sharedState.user.profile_type == "waiting_for_approval" ? (
        <Button
          onClick={() => approveUser()}
          type="primary-default"
          className="mr-2"
        >
          Approve
        </Button>
      ) : (
        <Button
          onClick={() => setShow(true)}
          disabled={isCurrentUserImpersonated || !sharedState.token.contract_id}
          type={currentUserId == user.id ? "white-subtle" : "primary-default"}
          className="mr-2"
        >
          Buy {ticker() || "Token"}
        </Button>
      )}
      {sharedState.token.contract_id && (
        <StakeModal
          show={show}
          setShow={setShow}
          tokenAddress={sharedState.token.contract_id}
          tokenId={sharedState.token.id}
          userId={currentUserId}
          talentUserId={talent.user_id}
          talentName={displayName({ withLink: false })}
          ticker={ticker()}
          railsContext={railsContext}
          mode={theme.mode()}
          talentIsFromCurrentUser={talentIsFromCurrentUser}
        />
      )}
      {!talentIsFromCurrentUser && (
        <Button
          onClick={() => (window.location.href = `/messages?user=${user.id}`)}
          type="white-subtle"
          mode={theme.mode()}
          className="mr-2 align-items-center"
          disabled={user.messaging_enabled}
        >
          {mobile && <Chat color="currentColor" className="mr-2" />}
          {!mobile && " Message"}
        </Button>
      )}
      {!talentIsFromCurrentUser && (
        <Button
          onClick={toggleWatchlist}
          type="white-subtle"
          mode={theme.mode()}
          disabled={changingFollow}
          className={cx(talentIsFromCurrentUser && "mr-2")}
        >
          {sharedState.isFollowing ? (
            <FontAwesomeIcon icon={faStar} className="text-warning" />
          ) : (
            <FontAwesomeIcon icon={faStarOutline} className="icon-bar" />
          )}
        </Button>
      )}
      {talentIsFromCurrentUser && (
        <Button
          onClick={() =>
            (window.location.href = `/u/${user.username}/edit_profile`)
          }
          type="white-subtle"
          mode={theme.mode()}
        >
          Edit Profile
        </Button>
      )}
      {talentIsFromCurrentUser && (
        <Tooltip
          body={"Copied!"}
          popOverAccessibilityId={"share_success"}
          mode={theme.mode()}
          placement="top"
        >
          <Button
            onClick={copyLinkToProfile}
            type="primary-default"
            mode={theme.mode()}
            className="ml-2"
          >
            Share
          </Button>
        </Tooltip>
      )}
    </div>
  );

  const alertBarColor = () => {
    if (user.profile_type == "approved") {
      return "green";
    } else if (
      (sharedState.user.profile_type == "waiting_for_approval" ||
        sharedState.user.profile_type == "talent") &&
      !sharedState.talent.public
    ) {
      return "primary";
    }
  };

  const alertBarText = () => {
    if (user.profile_type == "approved") {
      return "Your profile has been approved! You can now launch your Talent Token";
    } else if (
      (sharedState.user.profile_type == "waiting_for_approval" ||
        sharedState.user.profile_type == "talent") &&
      !sharedState.talent.public
    ) {
      return "Your profile is Private";
    }
  };

  const buttonText = () => {
    if (user.profile_type == "approved") {
      return "Launch Your Talent Token";
    } else if (
      (sharedState.user.profile_type == "waiting_for_approval" ||
        sharedState.user.profile_type == "talent") &&
      !sharedState.talent.public
    ) {
      return "Publish Profile";
    }
  };

  const buttonType = () => {
    if (user.profile_type == "approved") {
      return "positive-outline";
    } else if (
      (sharedState.user.profile_type == "waiting_for_approval" ||
        sharedState.user.profile_type == "talent") &&
      !sharedState.talent.public
    ) {
      return "primary-outline";
    }
  };

  const buttonClick = async () => {
    if (sharedState.user.profile_type == "approved") {
      window.location.href = `/u/${sharedState.user.username}/edit_profile?tab=Token`;
    }
    if (!sharedState.talent.public) {
      const params = {
        talent: {
          public: !sharedState.talent.public,
        },
        user: { id: sharedState.user.id },
      };
      const response = await patch(`/api/v1/talent/${talent.id}`, params).catch(
        () => {
          return false;
        }
      );
      if (response && !response.error) {
        setSharedState((prev) => ({
          ...prev,
          talent: {
            ...prev.talent,
            public: true,
          },
        }));
      }
    }
  };

  const showAlert =
    currentUserId == sharedState.user.id &&
    (sharedState.user.profile_type == "approved" ||
      (!sharedState.talent.public &&
        (sharedState.user.profile_type == "waiting_for_approval" ||
          sharedState.user.profile_type == "talent")));

  return (
    <div className="d-flex flex-column lg-h-100 p-0">
      {showAlert && (
        <div
          className="edit-profile-fixed-bar"
          style={{ height: mobile ? "75px" : "50px" }}
        >
          <div
            className={`edit-profile-talent-progress-container-${alertBarColor()} py-2 px-6 h-100`}
          >
            <div className="d-flex flex-row w-100 h-100 justify-content-between align-items-center">
              {/* below is required so the justify-content-between aligns properly */}
              <P3 text="" />
              <P3 text={alertBarText()} bold className="current-color" />
              <Button
                text={buttonText()}
                type={buttonType()}
                onClick={() => buttonClick()}
              />
            </div>
          </div>
        </div>
      )}
      {!sharedState.bannerUrl && sharedState.profilePictureUrl && (
        <TalentProfilePicture
          src={sharedState.profilePictureUrl}
          height={192}
          className="w-100 pull-bottom-content"
          straight
          blur
        />
      )}
      {sharedState.bannerUrl && (
        <TalentProfilePicture
          src={sharedState.bannerUrl}
          height={192}
          className="w-100 pull-bottom-content banner-img"
          straight={true}
        />
      )}
      <section
        className={cx(
          "d-flex flex-row mt-3 align-items-start justify-content-between flex-wrap",
          mobile && "px-4"
        )}
      >
        <div className="d-flex flex-row justify-content-start align-items-center flex-wrap">
          <div className="d-flex flex-row">
            <TalentProfilePicture
              src={sharedState.profilePictureUrl}
              height={mobile ? 120 : 192}
              border
            />
            {mobile && !publicPageViewer && actionButtons()}
          </div>
          <div className={cx("d-flex flex-column", !mobile && "ml-5")}>
            <div className="d-flex flex-row flex-wrap align-items-center justify-content-start mt-3 mt-lg-0">
              <H2
                mode={theme.mode()}
                text={displayName({ withLink: false })}
                bold
                className="mr-2 text-break"
              />
              {ticker() != "" && (
                <H2 bold text={`$${ticker()}`} className="text-primary-04" />
              )}
            </div>
            <div className="d-flex flex-row mb-lg-2 align-items-center pr-3">
              <H5
                bold
                text={sharedState.talent.profile.occupation}
                className="mb-2 mb-lg-0 text-primary-04"
              />
              {!mobile && <SocialRow profile={sharedState.talent.profile} />}
            </div>
            <div className="d-flex justify-content-between">
              <UserTags
                tags={sharedState.tags}
                className="mr-2"
                mode={theme.mode()}
              />
            </div>

            {mobile && <SocialRow profile={sharedState.talent.profile} />}
          </div>
        </div>
        {!mobile && !publicPageViewer && actionButtons()}
      </section>
      <div
        className={cx(
          "talent-table-tabs mt-3 d-flex flex-row align-items-center",
          mobile && "mx-4"
        )}
      >
        <div
          onClick={() => changeTab("overview")}
          className={`talent-table-tab${
            pageInDisplay == "overview" ? " active-talent-table-tab" : ""
          }`}
        >
          Overview
        </div>
        <div
          onClick={() => changeTab("timeline")}
          className={`talent-table-tab${
            pageInDisplay == "timeline" ? " active-talent-table-tab" : ""
          }`}
        >
          Timeline
        </div>
        {sharedState.token.contract_id && (
          <div
            onClick={() => changeTab("supporters")}
            className={`talent-table-tab${
              pageInDisplay == "supporters" ? " active-talent-table-tab" : ""
            }`}
          >
            Supporters
          </div>
        )}
        <div
          onClick={() => changeTab("supporting")}
          className={`talent-table-tab${
            pageInDisplay == "supporting" ? " active-talent-table-tab" : ""
          }`}
        >
          Supporting
        </div>
      </div>
      <div className={cx("d-flex flex-row flex-wrap", mobile && "px-4")}>
        <div
          className={`col-12${
            pageInDisplay != "supporters" && pageInDisplay != "supporting"
              ? " col-lg-8"
              : ""
          } p-0`}
          style={{ position: "unset" }}
        >
          {pageInDisplay == "overview" && (
            <Overview
              user={sharedState.user}
              profile={sharedState.talent.profile}
              careerGoal={sharedState.careerGoal}
              mode={theme.mode()}
            />
          )}
          {pageInDisplay == "timeline" && (
            <Timeline sharedState={sharedState} mode={theme.mode()} />
          )}
          {pageInDisplay == "supporters" && (
            <Supporters
              sharedState={sharedState}
              mobile={mobile}
              mode={theme.mode()}
              railsContext={railsContext}
            />
          )}
          {pageInDisplay == "supporting" && (
            <div className="mt-5">
              <Supporting
                wallet={user.wallet_id}
                publicPageViewer={publicPageViewer}
                withOptions={false}
                listMode={true}
                railsContext={railsContext}
              />
            </div>
          )}
        </div>
        {pageInDisplay != "supporters" && pageInDisplay != "supporting" && (
          <div className="col-12 col-lg-4 p-0 mt-4">
            <SimpleTokenDetails
              ticker={ticker()}
              token={token}
              mode={theme.mode()}
              railsContext={railsContext}
            />
          </div>
        )}
      </div>
      {pageInDisplay == "overview" && (
        <section className={cx("d-flex flex-column my-3", mobile && "px-4")}>
          <Roadmap
            goals={sharedState.goals}
            width={width}
            mode={theme.mode()}
            mobile={mobile}
          />
          <Perks
            perks={sharedState.perks}
            ticker={ticker()}
            width={width}
            contract={token.contract_id}
            railsContext={railsContext}
            talentUserId={talent.user_id}
            hideAction={talentIsFromCurrentUser}
            mode={theme.mode()}
          />
        </section>
      )}
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <TalentShow {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};

import React, { useState, useEffect, useContext } from "react";
import {
  faStar as faStarOutline,
  faEdit,
} from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { post, destroy } from "src/utils/requests";
import { useWindowDimensionsHook } from "../../utils/window";
import TalentProfilePicture from "./TalentProfilePicture";

import StakeModal from "../token/StakeModal";
import TalentTags from "./TalentTags";

import Overview from "./Show/Overview";
import Timeline from "./Show/Timeline";
import Supporters from "./Show/Supporters";

import Roadmap from "./Show/Roadmap";
import Perks from "./Show/Perks";
import TokenDetails from "./Show/TokenDetails";
import SocialRow from "./Show/SocialRow";

import Button from "src/components/design_system/button";
import { Chat } from "src/components/icons";
import { H2, H5 } from "src/components/design_system/typography";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import cx from "classnames";

const TalentShow = ({
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
}) => {
  const url = new URL(window.location);
  const searchParams = new URLSearchParams(url.search);

  const talentIsFromCurrentUser = talent.user_id == currentUserId;
  const [pageInDisplay, setPageInDisplay] = useState("overview");
  const [show, setShow] = useState(false);
  const [changingFollow, setChangingFollow] = useState(false);
  const { mobile, width } = useWindowDimensionsHook();
  const [sharedState, setSharedState] = useState({
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

  const changeTab = (tab) => {
    window.history.pushState({}, document.title, `${url.pathname}?tab=${tab}`);
    setPageInDisplay(tab);
  };

  useEffect(() => {
    if (searchParams.get("tab")) {
      setPageInDisplay(searchParams.get("tab"));
    } else {
      window.history.pushState(
        {},
        document.title,
        `${url.pathname}?tab=overview`
      );
    }
  }, [searchParams]);

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(document.location.search);
    setPageInDisplay(params.get("tab"));
  });

  const actionButtons = () => (
    <div className="d-flex flex-row flex-wrap flex-lg-nowrap justify-content-center justify-content-lg-start align-items-center mt-4 mt-lg-5 lg-w-100 lg-width-reset">
      <Button
        onClick={() => setShow(true)}
        disabled={!sharedState.token.contract_id}
        type="primary-default"
        mode={theme.mode()}
        className="mr-2"
      >
        Buy {ticker() || "Token"}
      </Button>
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
      <Button
        onClick={() => (window.location.href = `/messages?user=${user.id}`)}
        type="white-subtle"
        mode={theme.mode()}
        className="mr-2 align-items-center"
        disabled={user.messaging_enabled || (currentUserId == user.id)}
      >
        {mobile && <Chat color="currentColor" className="mr-2" />}
        {!mobile && " Message"}
      </Button>
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
      {talentIsFromCurrentUser && (
        <Button
          onClick={() =>
            (window.location.href = `/talent/${user.username}/edit_profile`)
          }
          type="white-subtle"
          mode={theme.mode()}
        >
          Edit Profile
        </Button>
      )}
    </div>
  );

  return (
    <div className="d-flex flex-column lg-h-100 p-0">
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
            {mobile && actionButtons()}
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
              {!mobile && <SocialRow sharedState={sharedState} />}
            </div>
            <div className="d-flex justify-content-between">
              <TalentTags
                tags={sharedState.tags}
                className="mr-2"
                mode={theme.mode()}
              />
            </div>

            {mobile && <SocialRow sharedState={sharedState} />}
          </div>
        </div>
        {!mobile && actionButtons()}
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
      </div>
      <div className={cx("d-flex flex-row flex-wrap", mobile && "pl-4")}>
        <div
          className={`col-12${
            pageInDisplay != "supporters" ? " col-lg-8" : ""
          } p-0`}
        >
          {pageInDisplay == "overview" && (
            <Overview sharedState={sharedState} mode={theme.mode()} />
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
        </div>
        {pageInDisplay != "supporters" && (
          <div className="col-12 col-lg-4 p-0 mb-4">
            <TokenDetails
              ticker={ticker()}
              token={token}
              displayName={displayName({ withLink: false })}
              username={sharedState.user.username}
              railsContext={railsContext}
              mobile={mobile}
            />
          </div>
        )}
      </div>
      {pageInDisplay == "overview" && (
        <section className={cx("d-flex flex-column my-3", mobile && "pl-4")}>
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

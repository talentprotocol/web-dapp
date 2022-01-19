import React, { useState, useMemo, useContext } from "react";
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
import EditProfile from "./Show/EditProfile";
import TalentTags from "./TalentTags";
import TalentBadges from "./TalentBadges";

import Roadmap from "./Show/Roadmap";
import Perks from "./Show/Perks";
import Overview from "./Show/Overview";
import Timeline from "./Show/Timeline";
import TokenDetails from "./Show/TokenDetails";

import { completeProfile } from "./utils/talent";

import Button from "src/components/design_system/button";
import { Chat } from "src/components/icons";
import { H2, P2 } from "src/components/design_system/typography";

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
  primaryTag,
  secondaryTags,
  careerGoal,
  goals,
  posts,
  isFollowing,
  badges,
  railsContext,
}) => {
  const talentIsFromCurrentUser = talent.user_id == currentUserId;
  const [pageInDisplay, setPageInDisplay] = useState("Overview");
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
    primaryTag,
    secondaryTags,
    isFollowing,
    careerGoal,
    goals,
    posts,
  });
  const theme = useContext(ThemeContext);

  const ticker = () =>
    sharedState.token.ticker ? `${sharedState.token.ticker}` : "";
  const allTags = () =>
    [sharedState.primaryTag]
      .concat(sharedState.secondaryTags)
      .filter((tag) => tag !== null && tag !== undefined);
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

  const prettifyWebsiteUrl = (url) => {
    try {
      const link = new URL(url);
      return link.host;
    } catch {
      return url;
    }
  };

  const toggleWatchlist = async () => {
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

  const profileIsComplete = useMemo(() => {
    return completeProfile(sharedState);
  }, [sharedState]);

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
          ticker={ticker()}
          railsContext={railsContext}
          mode={theme.mode()}
        />
      )}
      <Button
        onClick={() => (window.location.href = `/messages?user=${user.id}`)}
        type="white-subtle"
        mode={theme.mode()}
        className="mr-2 align-items-center"
      >
        {mobile && <Chat color="currentColor" className="mr-2" />}
        {!mobile && " Message"}
      </Button>
      <Button
        onClick={toggleWatchlist}
        type="white-subtle"
        mode={theme.mode()}
        disabled={changingFollow}
        className="mr-2"
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
          className="mr-2"
        >
          <FontAwesomeIcon icon={faEdit} />
        </Button>
      )}
    </div>
  );

  return (
    <div className="d-flex flex-column lg-h-100 p-0 lg-px-4">
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
          className="w-100 pull-bottom-content banner-height"
          straight={true}
        />
      )}
      <section
        className={cx(
          "d-flex flex-row mt-3 align-items-start justify-content-between flex-wrap",
          mobile ? "px-4" : "px-5"
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
          <div className="d-flex flex-column">
            <div className="d-flex flex-row flex-wrap align-items-center justify-content-start mt-3 mt-lg-0">
              <H2
                mode={theme.mode()}
                text={displayName({ withLink: false })}
                bold
              />
              {ticker() != "" && (
                <H2
                  bold
                  text={`$${ticker()}`}
                  className="text-primary-04 ml-2"
                />
              )}
            </div>
            <div className="d-flex flex-row pr-3 ml-3 ml-lg-0">
              <P2
                mode={theme.mode()}
                text={sharedState.talent.profile.occupation}
                className="mb-2"
              />
              {sharedState.talent.profile.website && (
                <a
                  href={sharedState.talent.profile.website}
                  target="self"
                  className="text-primary ml-2"
                >
                  {prettifyWebsiteUrl(sharedState.talent.profile.website)}
                </a>
              )}
            </div>
            <div className="d-flex justify-content-between ml-3 ml-lg-0">
              <TalentBadges badges={badges} height={40} />
              <TalentTags
                tags={allTags()}
                className="mr-2"
                mode={theme.mode()}
              />
            </div>
          </div>
        </div>
        {!mobile && actionButtons()}
      </section>
      <div
        className={cx(
          "talent-table-tabs mt-3 d-flex flex-row align-items-center",
          mobile ? "mx-4" : "mx-5"
        )}
      >
        <div
          onClick={() => setPageInDisplay("Overview")}
          className={`talent-table-tab${
            pageInDisplay == "Overview" ? " active-talent-table-tab" : ""
          }`}
        >
          Overview
        </div>
        <div
          onClick={() => setPageInDisplay("Timeline")}
          className={`talent-table-tab${
            pageInDisplay == "Timeline" ? " active-talent-table-tab" : ""
          }`}
        >
          Timeline
        </div>
      </div>
      <div
        className={cx("d-flex flex-row flex-wrap", mobile ? "px-4" : "px-5")}
      >
        <div className="col-12 col-lg-8 p-0">
          {pageInDisplay == "Overview" && (
            <Overview sharedState={sharedState} mode={theme.mode()} />
          )}
          {pageInDisplay == "Timeline" && (
            <Timeline sharedState={sharedState} mode={theme.mode()} />
          )}
        </div>
        <div className="col-12 col-lg-4 p-0">
          <TokenDetails
            ticker={ticker()}
            token={token}
            displayName={displayName({ withLink: false })}
            username={sharedState.user.username}
            railsContext={railsContext}
            mobile={mobile}
          />
        </div>
      </div>
      <section
        className={cx("d-flex flex-column my-3", mobile ? "px-4" : "px-5")}
      >
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

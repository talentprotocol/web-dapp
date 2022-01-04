import React, { useState, useMemo, useContext } from "react";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
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
import Tag from "src/components/design_system/tag";
import { Chat } from "src/components/icons";
import P2 from "src/components/design_system/typography/p2";
import H2 from "src/components/design_system/typography/h2";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

const TalentShow = ({
  talent,
  token,
  perks,
  milestones,
  current_user_id,
  token_live,
  user,
  profilePictureUrl,
  bannerUrl,
  primary_tag,
  secondary_tags,
  career_goal,
  goals,
  posts,
  isFollowing,
  badges,
  sign_up_path,
  railsContext,
}) => {
  const talentIsFromCurrentUser = talent.user_id == current_user_id;
  const [pageInDisplay, setPageInDisplay] = useState("Overview");
  const [show, setShow] = useState(false);
  const [changingFollow, setChangingFollow] = useState(false);
  const { height, width } = useWindowDimensionsHook();
  const mobile = width < 992;
  const [sharedState, setSharedState] = useState({
    talent,
    token,
    perks,
    milestones,
    current_user_id,
    token_live,
    bannerUrl,
    user,
    profilePictureUrl,
    primary_tag,
    secondary_tags,
    isFollowing,
    career_goal,
    goals,
    posts,
  });
  const theme = useContext(ThemeContext);

  const ticker = () =>
    sharedState.token.ticker ? `${sharedState.token.ticker}` : "";
  const allTags = () =>
    [sharedState.primary_tag].concat(sharedState.secondary_tags);
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
          userId={current_user_id}
          ticker={ticker()}
          railsContext={railsContext}
        />
      )}
      <Button
        onClick={() => (window.location.href = `/messages?user=${user.id}`)}
        type="white-subtle"
        mode={theme.mode()}
        className="mr-2 align-items-center"
      >
        <Chat color="currentColor" className="mr-2" />
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
          <FontAwesomeIcon icon={faStarOutline} className="text-warning" />
        )}
      </Button>
      <EditProfile
        {...sharedState}
        updateSharedState={setSharedState}
        inviteLink={sign_up_path}
        allowEdit={talentIsFromCurrentUser}
        profileIsComplete={profileIsComplete}
        railsContext={railsContext}
        mode={theme.mode()}
      />
    </div>
  );

  return (
    <div className="d-flex flex-column lg-h-100 p-0 px-lg-4">
      {!sharedState.bannerUrl && sharedState.profilePictureUrl && (
        <TalentProfilePicture
          src={sharedState.profilePictureUrl}
          height={192}
          className="w-100 pull-bottom-content"
          straight={true}
          blur
        />
      )}
      {sharedState.bannerUrl && (
        <TalentProfilePicture
          src={sharedState.bannerUrl}
          height={192}
          className="w-100 pull-bottom-content"
          straight={true}
        />
      )}
      <section className="d-flex flex-row mt-3 ml-lg-3 align-items-start justify-content-between flex-wrap">
        <div className="d-flex flex-row justify-content-start align-items-center flex-wrap">
          <div className="ml-3 ml-lg-0 mr-lg-2 d-flex flex-row">
            <TalentProfilePicture
              src={sharedState.profilePictureUrl}
              height={mobile ? 120 : 192}
            />
            {mobile && actionButtons()}
          </div>
          <div className="d-flex flex-column">
            <div className="d-flex flex-row align-items-center justify-content-start ml-3 ml-lg-0 mt-3 mt-lg-0">
              <H2
                mode={theme.mode()}
                text={displayName({ withLink: false })}
                bold
              />
              {ticker() != "" && (
                <Tag className="ml-2" mode={theme.mode()}>
                  <P2 mode={theme.mode()} text={ticker()} bold />
                </Tag>
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
      <div className="w-100 talent-table-tabs mt-3 d-flex flex-row align-items-center">
        <div
          onClick={() => setPageInDisplay("Overview")}
          className={`py-2 px-2 ml-3 talent-table-tab${
            pageInDisplay == "Overview" ? " active-talent-table-tab" : ""
          }`}
        >
          Overview
        </div>
        <div
          onClick={() => setPageInDisplay("Timeline")}
          className={`py-2 px-2 talent-table-tab${
            pageInDisplay == "Timeline" ? " active-talent-table-tab" : ""
          }`}
        >
          Timeline
        </div>
      </div>
      <div className="d-flex flex-row flex-wrap">
        <div className="col-12 col-lg-8">
          {pageInDisplay == "Overview" && (
            <Overview sharedState={sharedState} mode={theme.mode()} />
          )}
          {pageInDisplay == "Timeline" && (
            <Timeline sharedState={sharedState} mode={theme.mode()} />
          )}
        </div>
        <div className="col-12 col-lg-4">
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
      <section className="d-flex flex-column mx-3 my-3">
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

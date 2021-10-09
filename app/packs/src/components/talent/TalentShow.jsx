import React, { useState } from "react";
import {
  faCommentAlt,
  faStar as faStarOutline,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronRight,
  faStar,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { post, destroy } from "src/utils/requests";
import { useWindowDimensionsHook } from "../../utils/window";
import TalentProfilePicture from "./TalentProfilePicture";

import StakeModal from "../token/StakeModal";
import EditProfile from "./Show/EditProfile";
import TalentTags from "./TalentTags";
import TalentBadges from "./TalentBadges";
import Testimonials from "./Testimonials";

import Roadmap from "./Show/Roadmap";
import Services from "./Show/Services";
import Perks from "./Show/Perks";
import Overview from "./Show/Overview";
import Timeline from "./Show/Timeline";
import TokenDetails from "./Show/TokenDetails";

const TalentShow = ({
  talent,
  services,
  token,
  perks,
  milestones,
  current_user_id,
  token_live,
  user,
  profilePictureUrl,
  primary_tag,
  secondary_tags,
  career_goal,
  goals,
  posts,
  isFollowing,
  badges,
  testimonials,
}) => {
  const talentIsFromCurrentUser = talent.user_id == current_user_id;
  const [pageInDisplay, setPageInDisplay] = useState("Overview");
  const [show, setShow] = useState(false);
  const [changingFollow, setChangingFollow] = useState(false);
  const { height, width } = useWindowDimensionsHook();
  const [sharedState, setSharedState] = useState({
    talent,
    services,
    token,
    perks,
    milestones,
    current_user_id,
    token_live,
    user,
    profilePictureUrl,
    primary_tag,
    secondary_tags,
    isFollowing,
    career_goal,
    goals,
    posts,
    testimonials,
  });

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
    const link = new URL(url);
    return link.host;
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

  const updateTestimonials = (newTestimonial) => {
    setSharedState((prev) => ({
      ...prev,
      testimonials: [...testimonials, newTestimonial],
    }));
  }

  return (
    <div className="d-flex flex-column">
      <section className="mt-3">
        <div className="d-flex flex-row text-muted mx-3">
          <span>
            <a href="/talent" className="text-reset">
              <small>TALENT</small>
            </a>
          </span>
          <span className="mx-3">
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </span>
          <span className="text-uppercase">
            <small>{displayName({ withLink: false })}</small>
          </span>
        </div>
      </section>
      <section className="d-flex flex-row mt-3 ml-3 align-items-center justify-content-between flex-wrap">
        <div className="d-flex flex-row align-items-center flex-wrap">
          <TalentProfilePicture
            src={sharedState.profilePictureUrl}
            height={192}
            className="mr-2"
          />
          <div className="d-flex flex-column">
            <div className="d-flex flex-row align-items-center">
              <h2 className="mb-0">{displayName({ withLink: false })}</h2>
              <p className="mb-0 border rounded p-1 bg-light ml-2">
                <small>{ticker()}</small>
              </p>
              <button
                className="btn border-0 text-warning"
                onClick={toggleWatchlist}
                disabled={changingFollow}
              >
                {sharedState.isFollowing ? (
                  <FontAwesomeIcon icon={faStar} />
                ) : (
                  <FontAwesomeIcon icon={faStarOutline} />
                )}
              </button>
            </div>
            <div className="d-flex flex-row">
              <p>{sharedState.talent.profile.ocupation}</p>
              {sharedState.talent.profile.website && (
                <a
                  href={sharedState.talent.profile.website}
                  className="text-primary ml-2"
                >
                  {prettifyWebsiteUrl(sharedState.talent.profile.website)}
                </a>
              )}
            </div>
            <div className="d-flex justify-content-between">
              <TalentBadges badges={badges} height={40} />
              <TalentTags tags={allTags()} className="mr-2" />
            </div>
          </div>
        </div>
        <div className="d-flex flex-row align-items-center mt-2">
          <button
            className="btn btn-primary"
            style={{ height: 38, width: 99 }}
            onClick={() => setShow(true)}
          >
            Buy {ticker()}
          </button>
          {sharedState.token.contract_id && (
            <StakeModal
              show={show}
              setShow={setShow}
              tokenAddress={sharedState.token.contract_id}
              talentAddress={sharedState.user.wallet_id}
              ticker={ticker()}
            />
          )}
          <a href={`/message?user=${user.id}`} className="btn btn-light mx-2">
            <FontAwesomeIcon icon={faCommentAlt} /> Message
          </a>
          <EditProfile
            {...sharedState}
            updateSharedState={setSharedState}
            allowEdit={talentIsFromCurrentUser}
          />
        </div>
      </section>
      <div className="d-flex flex-row mx-3 mt-3">
        <button
          className={`btn rounded mr-2 p-1 underline-hover ${
            pageInDisplay == "Overview" && "btn-light active"
          }`}
          onClick={() => setPageInDisplay("Overview")}
        >
          <small>Overview</small>
        </button>
        <button
          className={`btn rounded mr-2 p-1 underline-hover ${
            pageInDisplay == "Timeline" && "btn-light active"
          }`}
          onClick={() => setPageInDisplay("Timeline")}
        >
          <small>Timeline</small>
        </button>
        <button
          className={`btn rounded mr-2 p-1 underline-hover ${
            pageInDisplay == "Activity" && "btn-light active"
          }`}
          onClick={() => setPageInDisplay("Activity")}
          disabled
        >
          <small>Activity</small>
        </button>
        <button
          className={`btn rounded mr-2 p-1 underline-hover ${
            pageInDisplay == "Community" && "btn-light active"
          }`}
          onClick={() => setPageInDisplay("Community")}
          disabled
        >
          <small>Community</small>
        </button>
      </div>
      <div className="d-flex flex-row flex-wrap">
        <div className="col-12 col-lg-8">
          {pageInDisplay == "Overview" && (
            <Overview sharedState={sharedState} />
          )}
          {pageInDisplay == "Timeline" && (
            <Timeline sharedState={sharedState} />
          )}
        </div>
        <div className="col-12 col-lg-4">
          <TokenDetails
            ticker={ticker()}
            token={token}
            displayName={displayName({ withLink: false })}
          />
        </div>
      </div>
      <section className="d-flex flex-column mx-3 my-3">
        <Roadmap goals={sharedState.goals} width={width} />
        <Services
          services={sharedState.services}
          ticker={ticker()}
          width={width}
        />
        <Perks perks={sharedState.perks} ticker={ticker()} width={width} />
        <Testimonials
          talentId={talent.id}
          testimonials={sharedState.testimonials}
          width={width}
          updateTestimonials={updateTestimonials}
        />
      </section>
    </div>
  );
};

export default TalentShow;

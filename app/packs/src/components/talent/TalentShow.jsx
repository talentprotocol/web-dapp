import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import Modal from "react-bootstrap/Modal";
import {
  faGithub,
  faTwitter,
  faLinkedin,
  faDiscord,
  faTelegram,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faCommentAlt,
  faStar as faStarOutline,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
  faStar,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseJSON, formatDistanceToNow } from "date-fns";
import parse from "html-react-parser";
import TalentProfilePicture from "./TalentProfilePicture";

import EditProfile from "./Show/EditProfile";
import TalentTags from "./TalentTags";

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
}) => {
  const talentIsFromCurrentUser = talent.user_id == current_user_id;
  const [pageInDisplay, setPageInDisplay] = useState("Overview");
  const [show, setShow] = useState(false);
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
    career_goal,
    goals,
    posts,
  });

  const ticker = () =>
    sharedState.token.ticker ? `$${sharedState.token.ticker}` : "";
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
      <section className="d-flex flex-row mt-3 ml-3 align-items-center">
        <TalentProfilePicture
          src={sharedState.profilePictureUrl}
          height={192}
        />
        <div className="d-flex flex-column ml-2">
          <div className="d-flex flex-row align-items-center">
            <h2 className="mb-0 mr-2">{displayName({ withLink: false })}</h2>
            <p className="mb-0 border rounded p-1 bg-light">
              <small>{ticker()}</small>
            </p>
            <button className="btn border-0 text-warning">
              {isFollowing ? (
                <FontAwesomeIcon icon={faStar} />
              ) : (
                <FontAwesomeIcon icon={faStarOutline} />
              )}
            </button>
          </div>
          <div className="d-flex flex-row">
            <p>{sharedState.talent.profile.headline}</p>
            <a
              href={sharedState.talent.profile.website}
              className="text-primary ml-2"
            >
              {prettifyWebsiteUrl(sharedState.talent.profile.website)}
            </a>
          </div>
          <TalentTags tags={allTags()} />
        </div>
        <div className="d-flex flex-row align-items-center ml-2">
          <button
            className="btn btn-secondary"
            style={{ height: 38, width: 99 }}
          >
            <small>GET {ticker()}</small>
          </button>
          <a href={`/message?user=${user.id}`} className="text-secondary ml-2">
            <FontAwesomeIcon icon={faCommentAlt} size="lg" />
          </a>
          <button className="btn btn-light bg-transparent border-0">
            <FontAwesomeIcon icon={faEllipsisV} size="lg" />
          </button>
        </div>
      </section>
      <div className="d-flex flex-row mx-3 mt-3">
        <button
          className={`btn btn-light rounded mr-2 ${
            pageInDisplay == "Overview" && "active"
          }`}
          onClick={() => setPageInDisplay("Overview")}
        >
          <small>Overview</small>
        </button>
        <button
          className={`btn btn-light rounded mr-2 ${
            pageInDisplay == "Timeline" && "active"
          }`}
          onClick={() => setPageInDisplay("Timeline")}
        >
          <small>Timeline</small>
        </button>
        <button
          className={`btn btn-light rounded mr-2 ${
            pageInDisplay == "Activity" && "active"
          }`}
          onClick={() => setPageInDisplay("Activity")}
          disabled
        >
          <small>Activity</small>
        </button>
        <button
          className={`btn btn-light rounded mr-2 ${
            pageInDisplay == "Community" && "active"
          }`}
          onClick={() => setPageInDisplay("Community")}
          disabled
        >
          <small>Community</small>
        </button>
      </div>
      <div className="d-flex flex-row">
        <div className="col-8">
          {pageInDisplay == "Overview" && (
            <Overview sharedState={sharedState} />
          )}
          {pageInDisplay == "Timeline" && (
            <Timeline sharedState={sharedState} />
          )}
        </div>
        <div className="col-4">
          <TokenDetails
            ticker={ticker()}
            displayName={displayName({ withLink: false })}
          />
        </div>
      </div>
      <section className="d-flex flex-column mx-3 mt-3">
        <Roadmap goals={sharedState.goals} />
        <Services services={sharedState.services} ticker={ticker()} />
        <Perks perks={sharedState.perks} ticker={ticker()} />
      </section>
      <EditProfile
        {...sharedState}
        updateSharedState={setSharedState}
        allowEdit={talentIsFromCurrentUser}
      />
    </div>
  );
};

export default TalentShow;

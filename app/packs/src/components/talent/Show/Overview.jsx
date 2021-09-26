import React from "react";
import ReactPlayer from "react-player/youtube";
import {
  faGithub,
  faTwitter,
  faLinkedin,
  faDiscord,
  faTelegram,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Overview = ({ sharedState }) => {
  return (
    <>
      <section className="d-flex flex-row mt-3 text-secondary">
        {sharedState.talent.profile.github && (
          <a
            href={sharedState.talent.profile.github}
            className="mr-3 text-reset"
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </a>
        )}
        {sharedState.talent.profile.linkedin && (
          <a
            href={sharedState.talent.profile.linkedin}
            className="mr-3 text-reset"
          >
            <FontAwesomeIcon icon={faLinkedin} size="lg" />
          </a>
        )}
        {sharedState.talent.profile.twitter && (
          <a
            href={sharedState.talent.profile.twitter}
            className="mr-3 text-reset"
          >
            <FontAwesomeIcon icon={faTwitter} size="lg" />
          </a>
        )}
        {sharedState.talent.profile.instagram && (
          <a
            href={sharedState.talent.profile.instagram}
            className="mr-3 text-reset"
          >
            <FontAwesomeIcon icon={faInstagram} size="lg" />
          </a>
        )}
        {sharedState.talent.profile.telegram && (
          <a
            href={`https://t.me/${sharedState.talent.profile.telegram}`}
            className="mr-3 text-reset"
          >
            <FontAwesomeIcon icon={faTelegram} size="lg" />
          </a>
        )}
        {sharedState.talent.profile.discord && (
          <a
            href={`https://discordapp.com/users/${sharedState.talent.profile.discord}`}
            className="mr-3 text-reset"
          >
            <FontAwesomeIcon icon={faDiscord} size="lg" />
          </a>
        )}
        {sharedState.talent.profile.email && (
          <a
            href={`mailto:${sharedState.talent.profile.email}`}
            className="mr-3 text-reset"
          >
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
          </a>
        )}
      </section>
      <section className="d-flex flex-row">
        <p className="text-uppercase text-secondary">
          <small>@{sharedState.user.username}</small>
        </p>
        <p className="text-uppercase text-secondary ml-2">
          <small>{sharedState.talent.profile.location}</small>
        </p>
      </section>
      <section className="d-flex flex-column mt-3">
        <h5>
          <strong>{sharedState.talent.profile.headline}</strong>
        </h5>
        <p>{sharedState.career_goal.bio}</p>
        <div className="dropdown-divider"></div>
        <h5>
          <strong>Pitch</strong>
        </h5>
        <p>{sharedState.career_goal.pitch}</p>
        <ReactPlayer
          url={sharedState.talent.profile.video}
          light
          width={"100%"}
        />
        <div className="dropdown-divider mb-4"></div>
        <h5>
          <strong>Challenges</strong>
        </h5>
        <p>{sharedState.career_goal.challenges}</p>
      </section>
    </>
  );
};

export default Overview;

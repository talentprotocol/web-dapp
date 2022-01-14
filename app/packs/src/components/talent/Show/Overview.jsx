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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Rocket } from "src/components/icons";
import P1 from "src/components/design_system/typography/p1";
import P2 from "src/components/design_system/typography/p2";

const Overview = ({ sharedState, mode }) => {
  return (
    <>
      <section className="d-flex flex-row mt-4">
        {sharedState.user.username && (
          <p className="text-uppercase text-secondary">
            <small>@{sharedState.user.username}</small>
          </p>
        )}
        {sharedState.talent.profile.location && (
          <p className="text-uppercase text-secondary ml-2">
            <small>{sharedState.talent.profile.location}</small>
          </p>
        )}
      </section>
      <section className="d-flex flex-column mt-3">
        {sharedState.talent.profile.headline && (
          <p>{sharedState.talent.profile.headline}</p>
        )}

        <div className="d-flex flex-row my-3 text-secondary">
          {sharedState.talent.profile.github && (
            <a
              href={sharedState.talent.profile.github}
              target="self"
              className="mr-3 text-reset"
            >
              <FontAwesomeIcon icon={faGithub} size="lg" />
            </a>
          )}
          {sharedState.talent.profile.linkedin && (
            <a
              href={sharedState.talent.profile.linkedin}
              target="self"
              className="mr-3 text-reset"
            >
              <FontAwesomeIcon icon={faLinkedin} size="lg" />
            </a>
          )}
          {sharedState.talent.profile.twitter && (
            <a
              href={sharedState.talent.profile.twitter}
              target="self"
              className="mr-3 text-reset"
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
          )}
          {sharedState.talent.profile.instagram && (
            <a
              href={sharedState.talent.profile.instagram}
              target="self"
              className="mr-3 text-reset"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          )}
          {sharedState.talent.profile.telegram && (
            <a
              href={`https://t.me/${sharedState.talent.profile.telegram}`}
              target="self"
              className="mr-3 text-reset"
            >
              <FontAwesomeIcon icon={faTelegram} size="lg" />
            </a>
          )}
          {sharedState.talent.profile.discord && (
            <a
              href={`https://discordapp.com/users/${sharedState.talent.profile.discord}`}
              target="self"
              className="mr-3 text-reset"
            >
              <FontAwesomeIcon icon={faDiscord} size="lg" />
            </a>
          )}
        </div>
        <div className="dropdown-divider"></div>
        <P1 mode={mode} text="Pitch" bold className="mb-3" />
        {sharedState.career_goal?.pitch && (
          <P2 mode={mode} text={sharedState.career_goal?.pitch} />
        )}
        {sharedState.talent.profile.video && (
          <ReactPlayer
            url={sharedState.talent.profile.video}
            light
            width={"100%"}
          />
        )}
        <div className="dropdown-divider mb-4"></div>
        <P1 mode={mode} text="Challenges" bold className="mb-3" />
        {sharedState.career_goal?.challenges && (
          <div className="d-flex flex-row w-100 align-items-center">
            <P2 mode={mode} text={sharedState.career_goal?.challenges} />
          </div>
        )}
      </section>
    </>
  );
};

export default Overview;

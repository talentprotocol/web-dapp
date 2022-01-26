import React from "react";
import { faGlobeEurope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faTwitter,
  faLinkedin,
  faDiscord,
  faTelegram,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SocialRow = ({ sharedState }) => {
  return (
    <div className="d-flex flex-row flex-wrap mt-3 mt-lg-0 ml-lg-4 text-primary-03">
      {sharedState.talent.profile.website && (
        <a
          href={sharedState.talent.profile.website}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faGlobeEurope} />
        </a>
      )}
      {sharedState.talent.profile.github && (
        <a
          href={sharedState.talent.profile.github}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      )}
      {sharedState.talent.profile.linkedin && (
        <a
          href={sharedState.talent.profile.linkedin}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      )}
      {sharedState.talent.profile.twitter && (
        <a
          href={sharedState.talent.profile.twitter}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      )}
      {sharedState.talent.profile.instagram && (
        <a
          href={sharedState.talent.profile.instagram}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      )}
      {sharedState.talent.profile.telegram && (
        <a
          href={`https://t.me/${sharedState.talent.profile.telegram}`}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faTelegram} />
        </a>
      )}
      {sharedState.talent.profile.discord && (
        <a
          href={`https://discordapp.com/users/${sharedState.talent.profile.discord}`}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faDiscord} />
        </a>
      )}
    </div>
  );
};

export default SocialRow;

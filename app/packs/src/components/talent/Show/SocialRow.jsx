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

const SocialRow = ({ profile }) => {
  return (
    <div className="d-flex flex-row flex-wrap mt-3 mt-lg-0 ml-lg-4 text-primary-03">
      {profile.website && (
        <a
          href={profile.website}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faGlobeEurope} />
        </a>
      )}
      {profile.github && (
        <a
          href={profile.github}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
      )}
      {profile.linkedin && (
        <a
          href={profile.linkedin}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      )}
      {profile.twitter && (
        <a
          href={profile.twitter}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      )}
      {profile.instagram && (
        <a
          href={profile.instagram}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      )}
      {profile.telegram && (
        <a
          href={`https://t.me/${profile.telegram}`}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faTelegram} />
        </a>
      )}
      {profile.discord && (
        <a
          href={`https://discordapp.com/users/${profile.discord}`}
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

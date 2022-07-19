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

import cx from "classnames";

const SocialRow = ({ profile, className }) => {
  const telegramLink = () => {
    if (profile.telegram.length > 0 && profile.telegram[0] == "@") {
      const link = "https://t.me/" + profile.telegram.substring(1);
      return link;
    } else if (
      profile.telegram.length > 0 &&
      (profile.telegram.includes("https:://") ||
        profile.telegram.includes("http://"))
    ) {
      return profile.telegram;
    } else {
      return "https://t.me/" + profile.telegram;
    }
  };
  return (
    <div
      className={cx(
        "d-flex flex-row flex-wrap text-primary-03",
        className ? className : "mt-3 mt-lg-0 ml-lg-4"
      )}
    >
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
          href={telegramLink()}
          target="self"
          className="mr-4 text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faTelegram} />
        </a>
      )}
      {/* discord links are actually broken
      {profile.discord && (
        <a
          href={profile.discord}
          target="self"
          className="text-reset hover-primary"
        >
          <FontAwesomeIcon icon={faDiscord} />
        </a>
      )} */}
    </div>
  );
};

export default SocialRow;

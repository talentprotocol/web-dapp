import React from "react";
import { string, shape } from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import { P1, P2, P3 } from "src/components/design_system/typography";

import cx from "classnames";

const MarketingCard = ({ link, title, imgUrl, description, user, date }) => {
  return (
    <a
      className="marketing-card d-flex flex-column justify-content-between"
      href={link}
      target="_blank"
    >
      <div className="d-flex flex-column">
        <img
          className={cx("image-fit")}
          src={imgUrl}
          width="100%"
          height={184}
          alt="Marketing Picture"
        />
        <P1 className="text-black mt-3" bold text={title} />
        <P2 className="text-primary-03" text={description} />
      </div>
      <div className="d-flex flex-row align-items-center mt-2">
        <TalentProfilePicture src={user.profilePictureUrl} height={32} />
        <div className="d-flex flex-column ml-3">
          <P2 className="text-black" bold text={user.name} />
          <P3 className="text-primary-03" text={dayjs(date).fromNow()} />
        </div>
      </div>
    </a>
  );
};

MarketingCard.propTypes = {
  link: string.isRequired,
  title: string.isRequired,
  imgUrl: string,
  description: string,
  user: shape({
    name: string,
    profilePictureUrl: string,
  }),
  date: string,
};

export default MarketingCard;

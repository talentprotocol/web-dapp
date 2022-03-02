import React from "react";
import { string, shape } from "prop-types";

import { P1, P2 } from "src/components/design_system/typography";
import { Caret } from "src/components/icons";
import Link from "src/components/design_system/link";

import cx from "classnames";

const MarketingCard = ({ link, title, imgUrl, description }) => {
  return (
    <div className="marketing-card d-flex flex-column justify-content-between">
      <div className="d-flex flex-column">
        <img
          className={cx("image-fit")}
          src={imgUrl}
          width="100%"
          height={184}
          alt="Marketing Picture"
          style={{ borderRadius: "4px" }}
        />
        <P1 className="text-black mt-3" bold text={title} />
        <P2 className="text-primary-03" text={description} />
      </div>
      <div className="d-flex flex-row align-items-center mt-2">
        <Link
          className="d-flex align-items-center"
          bold
          href={link}
          target="_blank"
          text="Learn More"
        >
          <Caret size={12} color="currentColor" className="rotate-270 ml-2" />
        </Link>
      </div>
    </div>
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

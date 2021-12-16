import React from "react";
import { string, oneOf } from "prop-types";
import TalentProfilePicture from "../../talent/TalentProfilePicture";
import TalentProfileBanner from "../../talent/TalentProfileBanner";
import cx from "classnames";

const Placeholder = ({ imgUrl, type, mode, className }) => {
  const calcHeight = () => {
    if (type === "photo") {
      return 150;
    } else if (type === "banner") {
      return 400;
    }
  };

  return (
    <div className={cx("container-avatar", className)}>
      {type === "photo" && (
        <>
          <TalentProfilePicture src={imgUrl} height={calcHeight()} />
        </>
      )}
      {type === "banner" && (
        <>
          <TalentProfileBanner src={imgUrl} height={calcHeight()} straight />
        </>
      )}
    </div>
  );
};

Placeholder.defaultProps = {
  imgUrl: null,
  mode: "light",
  type: "photo",
  className: "",
};

Placeholder.propTypes = {
  imgUrl: string,
  mode: oneOf(["light", "dark"]),
  type: oneOf(["photo", "banner"]),
  className: string,
};

export default Placeholder;

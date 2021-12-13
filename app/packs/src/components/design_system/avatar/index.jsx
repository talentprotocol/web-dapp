import React from "react";
import { string, oneOf } from "prop-types";
import TalentProfilePicture from "../../talent/TalentProfilePicture";
import cx from "classnames";
import P3 from "../typography/p3";
import P2 from "../typography/p2";

const Avatar = ({ imgUrl, name, token, mode, size }) => {
  const avatarSize = () => {
    if (size === "small" || size === "normal") {
      return 24;
    } else if (size === "big") {
      return 32;
    }
  };

  return (
    <div className="container-avatar">
      <TalentProfilePicture src={imgUrl} height={avatarSize()} />
      {size === "small" && (
        <>
          {name && <P3 bold mode={mode} text={name} className="avatar-name" />}
          {token && (
            <P3 bold mode={mode} text={token} className="avatar-token" />
          )}
        </>
      )}
      {(size === "normal" || size === "big") && (
        <>
          {name && <P2 bold mode={mode} text={name} className="avatar-name" />}
          {token && (
            <P2 bold mode={mode} text={token} className="avatar-token" />
          )}
        </>
      )}
    </div>
  );
};

Avatar.defaultProps = {
  imgUrl: null,
  name: null,
  token: null,
  label: null,
  mode: "light",
  size: "normal",
};

Avatar.propTypes = {
  imgUrl: string,
  name: string,
  token: string,
  mode: oneOf(["light", "dark"]),
  size: oneOf(["small", "normal", "big"]),
};

export default Avatar;

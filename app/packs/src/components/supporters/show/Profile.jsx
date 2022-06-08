import React, { useState, useContext } from "react";

import { useWindowDimensionsHook } from "src/utils/window";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";

import UserTags from "src/components/talent/UserTags";

import Overview from "src/components/talent/Show/Overview";

import Supporting from "./Supporting";
import SimpleTokenDetails from "src/components/talent/Show/SimpleTokenDetails";
import SocialRow from "src/components/talent/Show/SocialRow";

import Divider from "src/components/design_system/other/Divider";

import Button from "src/components/design_system/button";
import { H2, H5 } from "src/components/design_system/typography";

import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";
import cx from "classnames";

const Profile = ({
  investor,
  token,
  currentUserId,
  user,
  profilePictureUrl,
  bannerUrl,
  tags,
  railsContext,
}) => {
  const investorIsFromCurrentUser = investor.user_id == currentUserId;
  const publicPageViewer = !currentUserId;
  const { mobile } = useWindowDimensionsHook();
  const theme = useContext(ThemeContext);
  const [supportingCount, setSupportingCount] = useState(0);

  const displayName = ({ withLink }) => {
    if (investor.profile.website && withLink) {
      return (
        <a href={investor.profile.website} className="text-reset">
          {user.display_name || user.username}
        </a>
      );
    }
    return user.display_name || user.username;
  };

  const actionButtons = () => (
    <div className="d-flex flex-row flex-wrap flex-lg-nowrap justify-content-center justify-content-lg-start align-items-center mt-4 mt-lg-5 lg-w-100 lg-width-reset">
      {investorIsFromCurrentUser && (
        <Button
          onClick={() =>
            (window.location.href = `/u/${user.username}/edit_profile`)
          }
          type="white-subtle"
        >
          Edit Profile
        </Button>
      )}
    </div>
  );

  return (
    <div className="d-flex flex-column lg-h-100 p-0">
      {!bannerUrl && profilePictureUrl && (
        <TalentProfilePicture
          src={profilePictureUrl}
          height={192}
          className="w-100 pull-bottom-content"
          straight
          blur
        />
      )}
      {bannerUrl && (
        <TalentProfilePicture
          src={bannerUrl}
          height={192}
          className="w-100 pull-bottom-content banner-img"
          straight={true}
        />
      )}
      <section
        className={cx(
          "d-flex flex-row mt-3 align-items-start justify-content-between flex-wrap",
          mobile && "px-4"
        )}
      >
        <div className="d-flex flex-row justify-content-start align-items-center flex-wrap">
          <div className="d-flex flex-row">
            <TalentProfilePicture
              src={profilePictureUrl}
              height={mobile ? 120 : 192}
              border
            />
            {mobile && !publicPageViewer && actionButtons()}
          </div>
          <div className={cx("d-flex flex-column", !mobile && "ml-5")}>
            <div className="d-flex flex-row flex-wrap align-items-center justify-content-start mt-3 mt-lg-0">
              <H2
                text={displayName({ withLink: false })}
                bold
                className="mr-2 text-break"
              />
            </div>
            <div className="d-flex flex-row mb-lg-2 align-items-center pr-3">
              <H5
                bold
                text={investor.profile.occupation}
                className="mb-2 mb-lg-0 text-primary-04"
              />
              {!mobile && <SocialRow profile={investor.profile} />}
            </div>
            <div className="d-flex justify-content-between">
              <UserTags tags={tags} className="mr-2" mode={theme.mode()} />
            </div>

            {mobile && <SocialRow profile={investor.profile} />}
          </div>
        </div>
        {!mobile && !publicPageViewer && actionButtons()}
      </section>
      <div className={cx("d-flex flex-row flex-wrap", mobile && "px-4")}>
        <div className="col-12 col-lg-8 p-0" style={{ position: "unset" }}>
          <Overview
            user={user}
            profile={investor.profile}
            mode={theme.mode()}
          />
        </div>
        <div className="col-12 col-lg-4 p-0 mt-4">
          <SimpleTokenDetails
            token={token}
            mode={theme.mode()}
            railsContext={railsContext}
            supportingCount={supportingCount}
          />
        </div>
      </div>
      <Divider className="my-6" />
      <section className={cx("d-flex flex-column mb-4", mobile && "px-4")}>
        <Supporting
          wallet={user.wallet_id}
          railsContext={railsContext}
          setSupportingCount={setSupportingCount}
          publicPageViewer={publicPageViewer}
        />
      </section>
    </div>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer>
      <Profile {...props} railsContext={railsContext} />
    </ThemeContainer>
  );
};

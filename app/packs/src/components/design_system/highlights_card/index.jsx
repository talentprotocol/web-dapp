import React from "react";
import { string, bool, number, arrayOf, shape } from "prop-types";
import currency from "currency.js";

import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Link from "src/components/design_system/link";
import Tag from "src/components/design_system/tag";
import Divider from "src/components/design_system/other/Divider";
import { P1, P2, P3 } from "src/components/design_system/typography";
import { ArrowForward } from "src/components/icons";

const HighlightsCard = ({ title, users }) => {
  const icon = () => {
    switch (title) {
      case "Most Trendy":
        return "🔥";
      case "Latest Added":
        return "🚀";
      case "Launching Soon":
        return "💎";
      default:
        return null;
    }
  };
  return (
    <div className="highlights-card">
      <div className="d-flex justify-content-between align-items-center p-4 highlights-card-title">
        <div className="d-flex align-items-center">
          <span className="mr-2">{icon()}</span>
          <P1 className="text-black" bold text={title} />
        </div>
        <div className="d-flex align-items-center text-primary">
          <Link type="primary" text="Discover All" href="/talent" bold />
          <ArrowForward className="ml-2" color="currentColor" size={12} />
        </div>
      </div>
      <Divider />
      <div className="p-4 highlights-card-body">
        {users.map((user, index) => (
          <div
            key={`${user.id}-${index}`}
            className="d-flex justify-content-between highlights-card-user"
          >
            <div className="d-flex align-items-center">
              <TalentProfilePicture src={user.profilePictureUrl} height={32} />
              <P2 className="text-black ml-3" text={user.name} />
            </div>
            {title === "Launching Soon" ? (
              <Tag className="coming-soon-tag align-self-center ml-2">
                <P3 className="current-color" bold text="Coming Soon" />
              </Tag>
            ) : (
              <div className="d-flex flex-column align-items-end">
                <P3 className="text-primary-04" text="Market cap" />
                <P2
                  className="text-black"
                  text={currency(user.circulatingSupply).format()}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

HighlightsCard.defaultProps = {
  users: [],
};

HighlightsCard.propTypes = {
  title: string.isRequired,
  users: arrayOf(
    shape({
      id: number,
      name: string,
      profilePictureUrl: string,
      circulatingSupply: number,
    })
  ),
};

export default HighlightsCard;

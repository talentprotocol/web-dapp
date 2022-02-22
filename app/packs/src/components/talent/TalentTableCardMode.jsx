import React from "react";
import NewTalentCard from "src/components/design_system/cards/NewTalentCard";
import { useWindowDimensionsHook } from "src/utils/window";

import cx from "classnames";

const TalentTableCardMode = ({
  talents,
  updateFollow,
  watchlistOnly,
  getCirculatingSupply,
  getSupporterCount,
}) => {
  const { mobile } = useWindowDimensionsHook();

  const filteredTalents = () => {
    if (watchlistOnly) {
      return talents.filter((talent) => talent.isFollowing);
    } else {
      return talents;
    }
  };

  return (
    <div
      className={cx(
        "w-100 d-flex flex-wrap talents-cards-container",
        mobile ? "justify-content-center" : "justify-start"
      )}
    >
      {filteredTalents().map((talent) => (
        <div key={talent.id} className={cx("mt-3", !mobile && "pr-4")}>
          <NewTalentCard
            name={talent.user.name}
            ticker={talent.token.ticker}
            occupation={talent.occupation}
            profilePictureUrl={talent.profilePictureUrl}
            headline={talent.headline}
            isFollowing={talent.isFollowing}
            updateFollow={() => updateFollow(talent)}
            talentLink={`/talent/${talent.user.username}`}
            marketCap={getCirculatingSupply(talent.token.contractId)}
            supporterCount={getSupporterCount(talent.token.contractId)}
          />
        </div>
      ))}
    </div>
  );
};

export default TalentTableCardMode;

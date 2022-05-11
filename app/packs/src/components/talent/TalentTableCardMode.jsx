import React from "react";
import NewTalentCard from "src/components/design_system/cards/NewTalentCard";
import { useWindowDimensionsHook } from "src/utils/window";

import cx from "classnames";

const TalentTableCardMode = ({
  updateFollow,
  talents,
  env,
  publicPageViewer = false,
}) => {
  const { mobile } = useWindowDimensionsHook();

  return (
    <div
      className={cx(
        "w-100 d-flex flex-wrap talents-cards-container",
        mobile ? "justify-content-center" : "justify-start"
      )}
    >
      {talents.map((talent) => (
        <div key={talent.id} className={cx("mt-3", !mobile && "pr-4")}>
          <NewTalentCard
            name={talent.user.name}
            ticker={talent.token.ticker}
            chainId={talent.token.chainId}
            contractId={talent.token.contractId}
            occupation={talent.occupation}
            profilePictureUrl={talent.profilePictureUrl}
            headline={talent.headline}
            isFollowing={talent.isFollowing}
            updateFollow={() => updateFollow(talent)}
            talentLink={`/u/${talent.user.username}`}
            marketCap={talent.marketCap}
            supporterCount={talent.supporterCounter}
            publicPageViewer={publicPageViewer}
            env={env}
          />
        </div>
      ))}
    </div>
  );
};

export default TalentTableCardMode;

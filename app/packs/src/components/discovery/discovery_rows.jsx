import React, { useState, useCallback } from "react";
import { useWindowDimensionsHook } from "src/utils/window";
import { P1, P3 } from "src/components/design_system/typography";
import Link from "src/components/design_system/link";
import { Caret } from "src/components/icons";
import NewTalentCard from "src/components/design_system/cards/NewTalentCard";
import Button from "src/components/design_system/button";
import Tag from "src/components/design_system/tag";

import cx from "classnames";

const DiscoveryRows = ({ discoveryRows, updateFollow }) => {
  const [start, setStart] = useState(
    discoveryRows
      .map((row) => row.title)
      .reduce((acc, curr) => ((acc[curr] = 0), acc), {})
  );
  const { mobile, width } = useWindowDimensionsHook();

  const itemsPerRow = useCallback(
    (talents) => {
      if (width < 992) {
        return talents.length;
      }

      const card = 272;
      const actualWidth = width > 1240 ? 1240 : width;

      const numberOfCards = actualWidth / card;

      return Math.floor(numberOfCards);
    },
    [width]
  );

  const end = (title, talents) =>
    talents.length > itemsPerRow(talents)
      ? start[title] + itemsPerRow(talents)
      : talents.length;

  const sliceInDisplay = (title, talents) =>
    talents.slice(start[title], end(title, talents));

  const slideLeft = (title, talents) => {
    if (start[title] - itemsPerRow(talents) < 0) {
      setStart((prev) => ({ ...prev, [title]: 0 }));
    } else {
      setStart((prev) => ({
        ...prev,
        [title]: prev[title] - itemsPerRow(talents),
      }));
    }
  };
  const slideRight = (title, talents) => {
    if (start[title] + itemsPerRow(talents) >= talents.length) {
      setStart((prev) => ({ ...prev, [title]: talents.length - 1 }));
    } else {
      setStart((prev) => ({
        ...prev,
        [title]: prev[title] + itemsPerRow(talents),
      }));
    }
  };
  const disableLeft = (title) => start[title] === 0;
  const disableRight = (title, talents) =>
    start[title] + itemsPerRow(talents) >= talents.length;

  const discoveryBadge = (row) => {
    if (!!row.badge_link) {
      return (
        <a
          href={row.badge_link}
          className="cursor-pointer ml-2 "
          target="_blank"
        >
          <Tag className="bg-primary text-white cursor-pointer">
            <P3 className="current-color" bold text={row.badge} />
          </Tag>
        </a>
      );
    } else {
      return (
        <Tag className="ml-2 bg-primary text-white">
          <P3 className="current-color" bold text={row.badge} />
        </Tag>
      );
    }
  };

  return (
    <>
      {discoveryRows.map((row) => (
        <div key={row.title} className="discovery-row">
          {row.talents.length > 0 ? (
            <>
              <div className="d-flex justify-content-between">
                <div className="d-flex flex-row">
                  <P1
                    bold
                    text={row.title}
                    className={cx("text-black", mobile && "pl-4")}
                  />
                  {!!row.badge && discoveryBadge(row)}
                  <Link
                    className="mb-2 ml-3 d-flex align-items-center discover-all-link"
                    bold
                    href={`discovery/${row.slug}`}
                    text="Discover all"
                  >
                    <Caret
                      size={12}
                      color="currentColor"
                      className="rotate-270 ml-2"
                    />
                  </Link>
                </div>
                {row.talents.length > itemsPerRow(row.talents) && (
                  <div className="d-flex flex-row">
                    <Button
                      onClick={() => slideLeft(row.title, row.talents)}
                      disabled={disableLeft(row.title)}
                      type="white-ghost"
                      className="mr-2"
                    >
                      <Caret
                        size={16}
                        color="currentColor"
                        className="rotate-90"
                      />
                    </Button>
                    <Button
                      onClick={() => slideRight(row.title, row.talents)}
                      disabled={disableRight(row.title, row.talents)}
                      type="white-ghost"
                    >
                      <Caret
                        size={16}
                        color="currentColor"
                        className="rotate-270"
                      />
                    </Button>
                  </div>
                )}
              </div>
              <div
                className={cx(
                  "w-100 d-flex hide-scrollbar talents-cards-container justify-start pb-6",
                  mobile && "pl-4"
                )}
              >
                {sliceInDisplay(row.title, row.talents).map((talent) => (
                  <div key={talent.id} className="pt-3 pr-4">
                    <NewTalentCard
                      name={talent.name}
                      ticker={talent.ticker}
                      contractId={talent.contractId}
                      occupation={talent.occupation}
                      profilePictureUrl={talent.profilePictureUrl}
                      headline={talent.headline}
                      isFollowing={talent.isFollowing}
                      updateFollow={() => updateFollow(talent)}
                      talentLink={`/u/${talent.username}`}
                      marketCap={talent.marketCap}
                      supporterCount={talent.supporterCount}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ))}
    </>
  );
};

export default DiscoveryRows;

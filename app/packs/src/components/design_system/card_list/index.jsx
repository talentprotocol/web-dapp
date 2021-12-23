import React from "react";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import P2 from "src/components/design_system/typography/p2";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Star from "src/components/icons/Star";
import cx from "classnames";

const CardList = ({ talents, followerIds, mode }) => (
  <Table mode={mode}>
    <Table.Head>
      <Table.Th>
        <Caption bold text="" />
      </Table.Th>
      <Table.Th>
        <Caption bold text="#" />
      </Table.Th>
      <Table.Th>
        <Caption bold text="Talent" />
      </Table.Th>
      <Table.Th>
        <Caption bold text="Occupation" />
      </Table.Th>
      <Table.Th>
        <Caption bold text="Supporters" />
      </Table.Th>
      <Table.Th>
        <Caption bold text="Circulating Supply" />
      </Table.Th>
    </Table.Head>
    <Table.Body>
      {talents.map((talent) => (
        <Table.Tr key={talent.id}>
          <Table.Td>
            <Star
              pathClassName={
                followerIds.some((id) => id === talent.id)
                  ? "star"
                  : "star-outline"
              }
            />
          </Table.Td>
          <Table.Td>
            <P2 text={`${talent.id}`} />
          </Table.Td>
          <Table.Td>
            <div className="d-flex align-items-center">
              <TalentProfilePicture
                src={talent.profilePictureUrl}
                height={24}
              />
              <P2 text={talent.username} bold className="ml-2" />
              <P2
                text={talent.ticker}
                className="ml-2 text-uppercase wallet-id-text"
              />
            </div>
          </Table.Td>
          <Table.Td>
            <P2 text={talent.occupation} />
          </Table.Td>
          <Table.Td>
            <P2 text={`${talent.sponsorCount}`} />
          </Table.Td>
          <Table.Td>
            <P2 text={`${talent.circulatingSupply} ${talent.ticker}`} />
            <div className={cx("progress", mode)} style={{ height: 6 }}>
              <div
                className="progress-bar bg-secondary"
                role="progressbar"
                aria-valuenow={talent.progress}
                style={{ width: `${talent.progress}%` }}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </Table.Td>
        </Table.Tr>
      ))}
    </Table.Body>
  </Table>
);

export default CardList;

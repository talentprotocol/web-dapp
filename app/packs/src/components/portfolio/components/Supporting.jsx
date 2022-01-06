import React, { useState, useEffect } from "react";

import { parseAndCommify } from "src/onchain/utils";

import { get } from "src/utils/requests";

import P2 from "src/components/design_system/typography/p2";
import Button from "src/components/design_system/button";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";

const Supporting = ({ mode, talents, returnValues, onClaim }) => {
  const [talentProfilePictures, setTalentProfilePictures] = useState({});
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDirection = () => {
    if (sortDirection == "asc") {
      setSortDirection("desc");
    } else {
      setSortDirection("asc");
    }
  };

  const onOptionClick = (option) => {
    if (option == selectedSort) {
      toggleDirection();
    } else {
      setSortDirection("asc");
      setSelectedSort(option);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    talents.forEach((talent) => {
      get(`api/v1/talent/${talent.contract_id.toLowerCase()}`).then(
        (response) => {
          setTalentProfilePictures((prev) => ({
            ...prev,
            [talent.contract_id]: response.profilePictureUrl,
          }));
        }
      );
    });
  }, [talents]);

  const compareName = (talent1, talent2) => {
    if (talent1.name > talent2.name) {
      return 1;
    } else if (talent1.name < talent2.name) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareAmount = (talent1, talent2) => {
    if (parseFloat(talent1.amount) < parseFloat(talent2.amount)) {
      return 1;
    } else if (parseFloat(talent1.amount) > parseFloat(talent2.amount)) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareRewards = (talent1, talent2) => {
    const talent1Amount = parseFloat(
      returns(talent1.contract_id).replaceAll(",", "")
    );
    const talent2Amount = parseFloat(
      returns(talent2.contract_id).replaceAll(",", "")
    );

    if (talent1Amount < talent2Amount) {
      return 1;
    } else if (talent1Amount > talent2Amount) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortedTalents = () => {
    let desiredTalent = talents;
    if (sortDirection == "asc") {
      let comparisonFunction;

      switch (selectedSort) {
        case "Amount":
          comparisonFunction = compareAmount;
          break;
        case "TAL":
          comparisonFunction = compareAmount;
          break;
        case "Rewards":
          comparisonFunction = compareRewards;
          break;
        case "Alphabetical Order":
          comparisonFunction = compareName;
          break;
      }

      desiredTalent.sort(comparisonFunction);
    } else {
      desiredTalent.reverse();
    }

    return desiredTalent;
  };

  const talToUSD = (amount) => {
    return parseFloat(amount) * 0.02;
  };

  const sortIcon = (option) => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  const returns = (contract_id) => {
    if (returnValues[contract_id]) {
      return parseAndCommify(talToUSD(returnValues[contract_id].toString()));
    }

    return "0.0";
  };

  return (
    <>
      {/* <div className="d-flex flex-row justify-content-between flex-wrap w-100 mt-4">
        <div className="d-flex flex-column portfolio-amounts-overview mr-3 p-3">
          <P3 mode={mode} text={"Total Talent Tokens"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(talentTokensInCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(talentTokensInTAL).format().substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column portfolio-amounts-overview mr-3 p-3">
          <P3 mode={mode} text={"Rewards Claimed"} />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(totalRewardsInCUSD).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(parseFloat(rewardsClaimed))
                .format()
                .substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
        <div className="d-flex flex-column portfolio-amounts-overview p-3">
          <P3
            mode={mode}
            text={"Unclaimed Rewards"}
            className="text-warning portfolio-unclaimed-rewards"
          />
          <div className="d-flex flex-row flex-wrap mt-3 align-items-end">
            <H4
              mode={mode}
              text={currency(allUnclaimedRewards()).format()}
              bold
              className="mb-0 mr-2"
            />
            <P2
              mode={mode}
              text={`${currency(allUnclaimedRewards() * 5)
                .format()
                .substring(1)} $TAL`}
              bold
            />
          </div>
        </div>
      </div> */}
      <Table mode={mode} className="px-3 horizontal-scroll mt-4">
        <Table.Head>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Alphabetical Order")}
              bold
              text={`TALENT${sortIcon("Alphabetical Order")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Amount")}
              bold
              text={`AMOUNT${sortIcon("Amount")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("TAL")}
              bold
              text={`TAL LOCKED${sortIcon("TAL")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Rewards")}
              bold
              text={`REWARDS${sortIcon("Rewards")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption bold text="Action" />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {sortedTalents().map((talent) => (
            <Table.Tr
              key={`talent-${talent.contract_id}`}
              className="reset-cursor"
            >
              <Table.Td>
                <div
                  className="d-flex cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/talent/${talent.name}`)
                  }
                >
                  <TalentProfilePicture
                    src={talentProfilePictures[talent.contract_id]}
                    height="24"
                  />
                  <P2 text={`${talent.name}`} bold className="ml-2" />
                  <P2 text={`${talent.symbol}`} className="ml-2" />
                </div>
              </Table.Td>
              <Table.Td>
                <P2 text={parseAndCommify(talent.amount)} />
              </Table.Td>
              <Table.Td>
                <P2 text={parseAndCommify(talent.amount * 5)} />
              </Table.Td>
              <Table.Td className="pr-3">
                <P2 text={returns(talent.contract_id)} />
              </Table.Td>
              <Table.Td className="pr-3">
                <Button
                  onClick={() => onClaim(talent.contract_id)}
                  type="primary-ghost"
                  mode={mode}
                  className="mr-2 remove-background underline-hover"
                >
                  Claim rewards
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default Supporting;

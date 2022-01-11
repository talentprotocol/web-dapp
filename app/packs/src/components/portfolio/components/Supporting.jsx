import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { OrderBy } from "src/components/icons";

import { parseAndCommify } from "src/onchain/utils";

import { get } from "src/utils/requests";

import P2 from "src/components/design_system/typography/p2";
import H5 from "src/components/design_system/typography/h5";
import Button from "src/components/design_system/button";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";

const MobileSupportingDropdown = ({
  show,
  hide,
  mode,
  selectedOption,
  order,
  onOptionClick,
}) => {
  const selectedClass = (option) =>
    option == selectedOption ? " text-primary" : "";
  return (
    <Modal
      show={show}
      fullscreen="true"
      onHide={hide}
      dialogClassName={"m-0 mw-100 table-options-dropdown"}
    >
      <Modal.Body className="d-flex flex-column p-0">
        <small className="text-muted p-3">View</small>
        <div className={`divider ${mode}`}></div>
        <Button
          onClick={() => onOptionClick("Amount")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass(
            "Supporters"
          )}`}
        >
          Amount{" "}
          {selectedOption == "Amount" && (
            <OrderBy className={order == "asc" ? "" : "rotate-svg"} />
          )}
        </Button>
        <Button
          onClick={() => onOptionClick("Rewards")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass(
            "Occupation"
          )}`}
        >
          Unclaimed Rewards{" "}
          {selectedOption == "Rewards" && (
            <OrderBy className={order == "asc" ? "" : "rotate-svg"} />
          )}
        </Button>
        <Button
          onClick={() => onOptionClick("Alphabetical Order")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass(
            "Alphabetical Order"
          )}`}
        >
          Alphabetical Order
          {selectedOption == "Alphabetical Order" && (
            <OrderBy className={order == "asc" ? "" : "rotate-svg"} />
          )}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const Supporting = ({ mode, talents, mobile, returnValues, onClaim }) => {
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

  const getSelectedOptionValue = (talent) => {
    switch (selectedSort) {
      case "Amount":
        return parseAndCommify(talent.amount);
      case "Rewards":
        return returns(talent.contract_id);
      case "Alphabetical Order":
        return parseAndCommify(talent.amount);
    }
  };

  if (sortedTalents().length == 0) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <H5 mode={mode} text="You are not supporting any Talent" bold />
        <P2
          mode={mode}
          text="All your talent tokens will be listed here"
          bold
        />
        <Button
          onClick={() => (window.location.href = "/talent")}
          type="primary-default"
          mode={mode}
          className="mt-3"
        >
          See talent
        </Button>
      </div>
    );
  }

  if (mobile) {
    return (
      <>
        <MobileSupportingDropdown
          show={showDropdown}
          hide={() => setShowDropdown(false)}
          mode={theme.mode()}
          selectedOption={selectedSort}
          order={sortDirection}
          onOptionClick={onOptionClick}
        />
        <Table mode={theme.mode()} className="horizontal-scroll">
          <Table.Body>
            {sortedTalents().map((talent) => (
              <Table.Tr
                key={`talent-${talent.contract_id}`}
                onClick={() =>
                  (window.location.href = `/talent/${talent.username}`)
                }
              >
                <Table.Td>
                  <div
                    className="d-flex cursor-pointer"
                    onClick={() => console.log("SHOW TALENT DETAILS")}
                  >
                    <TalentProfilePicture
                      src={talentProfilePictures[talent.contract_id]}
                      height="24"
                    />
                    <P2 text={`${talent.name}`} bold className="ml-2" />
                  </div>
                </Table.Td>
                <Table.Td className="text-right pr-3">
                  <P2 text={getSelectedOptionValue(talent)} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Body>
        </Table>
      </>
    );
  }

  return (
    <>
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

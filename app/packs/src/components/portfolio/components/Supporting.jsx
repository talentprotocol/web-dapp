import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import currency from "currency.js";

import { parseAndCommify } from "src/onchain/utils";

import { get } from "src/utils/requests";

import {
  H4,
  H5,
  P2,
  P3,
  Caption,
} from "src/components/design_system/typography";
import Button from "src/components/design_system/button";
import TalentProfilePicture from "src/components/talent/TalentProfilePicture";
import Table from "src/components/design_system/table";
import Link from "src/components/design_system/link";
import { OrderBy } from "src/components/icons";

const concatenateSupportingAddresses = (supporting) =>
  `?tokens[]=${supporting.map((s) => s.id).join("&tokens[]=")}`;

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
            <OrderBy className={order == "asc" ? "" : "rotate-180"} />
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
            <OrderBy className={order == "asc" ? "" : "rotate-180"} />
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
            <OrderBy className={order == "asc" ? "" : "rotate-180"} />
          )}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

const Supporting = ({
  mode,
  talents,
  mobile,
  returnValues,
  onClaim,
  talentTokensInCUSD,
  talentTokensInTAL,
  loading,
}) => {
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
    get(`api/v1/public_talent/${concatenateSupportingAddresses(talents)}`).then(
      (response) => {
        response.forEach((element) => {
          setTalentProfilePictures((prev) => ({
            ...prev,
            [element.token.contract_id]: element.profilePictureUrl,
          }));
        });
      }
    );
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

    if (sortDirection != "asc") {
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
      return parseAndCommify(returnValues[contract_id].toString());
    }

    return "0.0";
  };

  const returnsUSD = (contract_id) => {
    if (returnValues[contract_id]) {
      return parseAndCommify(talToUSD(returnValues[contract_id].toString()));
    }

    return "0.0";
  };

  const getSelectedOptionValue = (talent) => {
    switch (selectedSort) {
      case "Amount":
        return `${parseAndCommify(talent.amount)} ${talent.symbol}`;
      case "Rewards":
        return `${returns(talent.contract_id)} TAL`;
      case "Alphabetical Order":
        return `${parseAndCommify(talent.amount)} ${talent.symbol}`;
    }
  };

  const getSelectedOptionValueUSD = (talent) => {
    switch (selectedSort) {
      case "Amount":
        return `$${parseAndCommify(talent.amount * 0.1)}`;
      case "Rewards":
        return `$${returnsUSD(talent.contract_id)}`;
      case "Alphabetical Order":
        return `$${parseAndCommify(talent.amount * 0.1)}`;
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
          mode={mode}
          selectedOption={selectedSort}
          order={sortDirection}
          onOptionClick={onOptionClick}
        />
        <div className="d-flex flex-column w-100 mt-3 px-4">
          <P3 bold mode={mode} text="Talent Tokens Balance" />
          <div className="d-flex flex-row w-100 align-items-end mt-3">
            <H4
              mode={mode}
              text={currency(talentTokensInCUSD).format()}
              bold
              className="mb-0"
            />
            <P2
              mode={mode}
              text={`${currency(talentTokensInTAL).format().substring(1)} $TAL`}
              className="ml-2"
            />
          </div>
        </div>
        <div className="d-flex flex-row w-100 justify-content-between align-items-middle mt-3 px-2">
          <Button onClick={() => null} type="white-ghost" mode={mode}>
            Talent
          </Button>
          <Button
            onClick={() => setShowDropdown(true)}
            type="white-ghost"
            mode={mode}
          >
            {selectedSort} <OrderBy black={true} />
          </Button>
        </div>
        <div className={`divider ${mode} my-2`}></div>
        <Table mode={mode} className="horizontal-scroll">
          <Table.Body>
            {sortedTalents().map((talent) => (
              <Table.Tr
                key={`talent-${talent.contract_id}`}
                onClick={() => onClaim(talent.contract_id)}
                className="px-2"
              >
                <Table.Td>
                  <div className="d-flex cursor-pointer pl-4 py-2">
                    <TalentProfilePicture
                      src={talentProfilePictures[talent.contract_id]}
                      height="24"
                    />
                    <P2 text={`${talent.name}`} bold className="ml-2" />
                  </div>
                </Table.Td>
                <Table.Td className="d-flex flex-column justify-content-center align-items-end pr-4 py-2">
                  <P2
                    bold
                    text={getSelectedOptionValueUSD(talent)}
                    className="text-black"
                  />
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
                  onClick={() => (window.location.href = `/u/${talent.name}`)}
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
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <P2
                    bold
                    text={`$${parseAndCommify(talent.amount * 0.1)}`}
                    className="text-black"
                  />
                  <P2
                    text={`${parseAndCommify(talent.amount)} ${talent.symbol}`}
                  />
                </div>
              </Table.Td>
              <Table.Td>
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <P2
                    bold
                    text={`$${parseAndCommify(talent.amount * 0.1)}`}
                    className="text-black"
                  />
                  <P2 text={`${parseAndCommify(talent.amount * 5)} TAL`} />
                </div>
              </Table.Td>
              <Table.Td>
                <div className="d-flex flex-column justify-content-center align-items-start">
                  <P2
                    bold
                    text={`$${returnsUSD(talent.contract_id)}`}
                    className="text-black"
                  />
                  <P2 text={`${returns(talent.contract_id)} TAL`} />
                </div>
              </Table.Td>
              <Table.Td className="pr-3">
                <button
                  onClick={() => onClaim(talent.contract_id)}
                  className="mr-2 button-link remove-background"
                >
                  <Link text="Claim rewards" bold />
                </button>
              </Table.Td>
            </Table.Tr>
          ))}
          {loading && (
            <Table.Tr>
              <Table.Td>
                <P2>Checking for more talent...</P2>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Body>
      </Table>
    </>
  );
};

export default Supporting;

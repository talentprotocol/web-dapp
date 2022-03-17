import React, { useState, useMemo, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { ethers } from "ethers";

import { parseAndCommify } from "src/onchain/utils";
import { get } from "src/utils/requests";
import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO_FOR_ID,
  client,
} from "src/utils/thegraph";

import { Spinner, OrderBy } from "src/components/icons";
import { P1, P2, H5 } from "src/components/design_system/typography";
import TalentProfilePicture from "../TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import Button from "src/components/design_system/button";

import cx from "classnames";

const MobileSupportersDropdown = ({
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
            "Occupation"
          )}`}
        >
          Amount{" "}
          {selectedOption == "Amount" && (
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

const Supporters = ({ mobile, mode, sharedState }) => {
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO_FOR_ID, {
    variables: { id: sharedState.token.contract_id.toLowerCase() },
  });
  const [supporterInfo, setSupporterInfo] = useState({});
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

  const supporters = useMemo(() => {
    if (!data || data.talentToken == null) {
      return [];
    }

    return data.talentToken.supporters.map(({ amount, supporter }) => ({
      id: supporter.id,
      amount: ethers.utils.formatUnits(amount),
    }));
  }, [data]);

  useEffect(() => {
    supporters.forEach((supporter) => {
      get(`/api/v1/users/${supporter.id.toLowerCase()}`).then((response) => {
        setSupporterInfo((prev) => ({
          ...prev,
          [supporter.id]: {
            profilePictureUrl: response.profilePictureUrl,
            username: response.username,
            id: response.id,
          },
        }));
      });
    });
  }, [supporters]);

  const compareName = (supporter1, supporter2) => {
    if (supporter1.name > supporter2.name) {
      return 1;
    } else if (supporter1.name < supporter2.name) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareAmount = (user1, user2) => {
    if (parseFloat(user1.amount) < parseFloat(user2.amount)) {
      return 1;
    } else if (parseFloat(user1.amount) > parseFloat(user2.amount)) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortedSupporters = () => {
    let desiredSupporters = supporters;

    let comparisonFunction;

    switch (selectedSort) {
      case "Amount":
        comparisonFunction = compareAmount;
        break;
      case "Alphabetical Order":
        comparisonFunction = compareName;
        break;
    }

    desiredSupporters.sort(comparisonFunction);
    if (sortDirection != "asc") {
      desiredSupporters.reverse();
    }

    return desiredSupporters;
  };

  const sortIcon = (option) => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  if (loading) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <Spinner />
      </div>
    );
  }

  if (!loading && sortedSupporters().length == 0) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <H5 text="There's no supporters" bold />
        <P2 text="All supporters will be listed here" bold />
      </div>
    );
  }

  const getSelectedOptionValue = (supporter) => {
    switch (selectedSort) {
      case "Amount":
        return `${parseAndCommify(supporter.amount)} ${
          sharedState.token.ticker
        }`;
      case "Alphabetical Order":
        return `${parseAndCommify(supporter.amount)} ${
          sharedState.token.ticker
        }`;
    }
  };

  const supporterName = (supporter) => {
    let fullName = "";
    if (supporterInfo[supporter.id]?.username) {
      fullName += `@${supporterInfo[supporter.id]?.username}\n`;
    }
    fullName += `(${supporter.id.substring(0, 10)}...)`;
    return fullName;
  };

  const goToSupporterProfile = (supporter) => {
    if (supporterInfo[supporter.id]?.username) {
      window.location.href = `/u/${supporterInfo[supporter.id]?.username}`;
    }
  };

  if (mobile) {
    return (
      <>
        <MobileSupportersDropdown
          show={showDropdown}
          hide={() => setShowDropdown(false)}
          mode={mode}
          selectedOption={selectedSort}
          order={sortDirection}
          onOptionClick={onOptionClick}
        />
        <div className="d-flex flex-row w-100 justify-content-between align-items-middle mt-3 px-2">
          <Button onClick={() => null} type="white-ghost" mode={mode}>
            Supporter
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
        <Table mode={mode} className="horizontal-scroll mb-4">
          <Table.Body>
            {sortedSupporters().map((supporter) => (
              <Table.Tr
                key={`supporter-${supporter.id}`}
                className={cx(
                  "px-2",
                  supporterInfo[supporter.id]?.username
                    ? "cursor-pointer"
                    : "reset-cursor"
                )}
                onClick={() => goToSupporterProfile(supporter)}
              >
                <Table.Td href="/">
                  <div className="d-flex cursor-pointer py-2">
                    <TalentProfilePicture
                      src={supporterInfo[supporter.id]?.profilePictureUrl}
                      height="24"
                    />
                    <P2
                      text={supporterName(supporter)}
                      bold
                      className="ml-2 text-white-space-wrap"
                    />
                  </div>
                </Table.Td>
                <Table.Td className="text-right pr-4 py-2">
                  <P2 text={getSelectedOptionValue(supporter)} />
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
      <H5 className="mt-5 mb-6" bold>
        Supporters
      </H5>
      <Table mode={mode} className="px-3 horizontal-scroll mb-4">
        <Table.Head>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Alphabetical Order")}
              bold
              text={`SUPPORTER${sortIcon("Alphabetical Order")}`}
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
        </Table.Head>
        <Table.Body>
          {sortedSupporters().map((supporter) => (
            <Table.Tr
              key={`supporter-${supporter.id}`}
              className={cx(
                supporterInfo[supporter.id]?.username
                  ? "cursor-pointer"
                  : "reset-cursor"
              )}
              onClick={() => goToSupporterProfile(supporter)}
            >
              <Table.Td>
                <div className="d-flex flex-row">
                  <TalentProfilePicture
                    src={supporterInfo[supporter.id]?.profilePictureUrl}
                    height="24"
                  />
                  {supporterInfo[supporter.id]?.username && (
                    <P2
                      text={`${supporterInfo[supporter.id]?.username}`}
                      bold
                      className="ml-2"
                    />
                  )}
                  <P2
                    text={`(${supporter.id.substring(0, 10)}...)`}
                    className="ml-2 text-gray-300"
                  />
                </div>
              </Table.Td>
              <Table.Td>
                <P2 text={getSelectedOptionValue(supporter)} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default (props) => (
  <ApolloProvider client={client(props.railsContext.contractsEnv)}>
    <Supporters {...props} />
  </ApolloProvider>
);

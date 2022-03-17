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
  PAGE_SIZE,
} from "src/utils/thegraph";
import { shortenAddress } from "src/utils/viewHelpers";

import { Spinner, OrderBy } from "src/components/icons";
import { P1, P2, H5 } from "src/components/design_system/typography";
import TalentProfilePicture from "../TalentProfilePicture";
import Table from "src/components/design_system/table";
import Caption from "src/components/design_system/typography/caption";
import Button from "src/components/design_system/button";

import cx from "classnames";

const arrayToObject = (inputArray, key) => {
  const obj = {};

  inputArray.forEach((element) => (obj[element[key]] = element));

  return obj;
};

const concatenateSupporterAddresses = (supporters) =>
  `?supporters[]=${supporters.map((s) => s.id).join("&supporters[]=")}`;

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
  const [supporterInfo, setSupporterInfo] = useState({});
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showDropdown, setShowDropdown] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [supporters, setSupporters] = useState([]);
  const [page, setPage] = useState(0);

  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO_FOR_ID, {
    variables: {
      id: sharedState.token.contract_id.toLowerCase(),
      skip: page * PAGE_SIZE,
      first: PAGE_SIZE,
    },
  });

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

  const populateNewSupporters = (newSupporters) => {
    if (newSupporters.length === 0) {
      return;
    }

    get(
      `/api/v1/supporters/${concatenateSupporterAddresses(newSupporters)}`
    ).then((response) => {
      if (response.supporters.length > 0) {
        const supportersTransformed = arrayToObject(
          response.supporters,
          "wallet_id"
        );

        setSupporterInfo((prev) => ({
          ...prev,
          ...supportersTransformed,
        }));
      }
    });
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  useEffect(() => {
    if (!data || data.talentToken == null) {
      return [];
    }

    if (localLoading) {
      setLocalLoading(false);
    }

    const newSupporters = data.talentToken.supporters.map(
      ({ amount, supporter }) => ({
        id: supporter.id,
        amount: ethers.utils.formatUnits(amount),
      })
    );

    if (data.talentToken.supporters.length == PAGE_SIZE) {
      loadMore();
    }

    setSupporters((prev) => [...prev, ...newSupporters]);
  }, [data]);

  useEffect(() => {
    const supportersWithNoInfo = supporters.filter(
      (item) => !supporterInfo[item.id]
    );

    populateNewSupporters(supportersWithNoInfo);
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

  const sortedSupporters = useMemo(() => {
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
  }, [supporters, sortDirection, selectedSort]);

  const sortIcon = (option) => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  if (localLoading) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <Spinner />
      </div>
    );
  }

  if (!localLoading && sortedSupporters.length == 0) {
    return (
      <div className="w-100 h-100 d-flex flex-column justify-content-center align-items-center mt-3">
        <H5 text="This user has no supporters yet" bold />
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
    fullName += `(${shortenAddress(supporter.id)})`;
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
            {sortedSupporters.map((supporter) => (
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
          {sortedSupporters.map((supporter) => (
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
                    text={`(${shortenAddress(supporter.id)})`}
                    className="ml-2 text-gray-300"
                  />
                </div>
              </Table.Td>
              <Table.Td>
                <P2 text={getSelectedOptionValue(supporter)} />
              </Table.Td>
            </Table.Tr>
          ))}
          {loading && (
            <Table.Tr>
              <Table.Td>
                <P2>Checking for more supporters...</P2>
              </Table.Td>
            </Table.Tr>
          )}
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

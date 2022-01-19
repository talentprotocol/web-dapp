import React, { useState, useContext } from "react";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ethers } from "ethers";
import { useWindowDimensionsHook } from "../../utils/window";
import Modal from "react-bootstrap/Modal";
import { OrderBy } from "src/components/icons";

import {
  ApolloProvider,
  useQuery,
  GET_TALENT_PORTFOLIO,
  client,
} from "src/utils/thegraph";
import { post, destroy } from "src/utils/requests";
import ThemeContainer, { ThemeContext } from "src/contexts/ThemeContext";

import TalentProfilePicture from "./TalentProfilePicture";
import Table from "src/components/design_system/table";
import P2 from "src/components/design_system/typography/p2";
import Caption from "src/components/design_system/typography/caption";
import Button from "src/components/design_system/button";

const MobileTalentTableDropdown = ({
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
          onClick={() => onOptionClick("Supporters")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass(
            "Supporters"
          )}`}
        >
          Supporters{" "}
          {selectedOption == "Supporters" && (
            <OrderBy className={order == "asc" ? "" : "rotate-svg"} />
          )}
        </Button>
        <Button
          onClick={() => onOptionClick("Occupation")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass(
            "Occupation"
          )}`}
        >
          Occupation{" "}
          {selectedOption == "Occupation" && (
            <OrderBy className={order == "asc" ? "" : "rotate-svg"} />
          )}
        </Button>
        <Button
          onClick={() => onOptionClick("Circulating Supply")}
          type="white-ghost"
          mode={mode}
          className={`d-flex flex-row justify-content-between px-4 my-2${selectedClass(
            "Circulating Supply"
          )}`}
        >
          Circulating Supply{" "}
          {selectedOption == "Circulating Supply" && (
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

const TalentTable = ({ talents }) => {
  const [changingFollow, setChangingFollow] = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const { loading, error, data } = useQuery(GET_TALENT_PORTFOLIO);
  const [sortDirection, setSortDirection] = useState("asc");
  const { height, width } = useWindowDimensionsHook();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Alphabetical Order");
  const theme = useContext(ThemeContext);
  const getInitialFollows = () => {
    const allFollows = {};

    talents.forEach((talent) => {
      allFollows[talent.id] = talent.isFollowing;
    });

    return allFollows;
  };

  const [follows, setFollows] = useState(getInitialFollows());

  const toggleWatchlist = async (talent) => {
    setChangingFollow(true);
    if (talent.isFollowing) {
      const response = await destroy(
        `/api/v1/follows?user_id=${talent.user_id}`
      ).catch(() => setChangingFollow(false));

      if (response.success) {
        setFollows((prev) => ({ ...prev, [talent.id]: false }));
      }
    } else {
      const response = await post(`/api/v1/follows`, {
        user_id: talent.user_id,
      }).catch(() => setChangingFollow(false));

      if (response.success) {
        setFollows((prev) => ({ ...prev, [talent.id]: true }));
      }
    }
    setChangingFollow(false);
  };

  const getSupporterCount = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(chosenTalent.supporterCounter);
    }
    return 0;
  };

  const getCirculatingSupply = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      return ethers.utils.commify(
        ethers.utils.formatUnits(chosenTalent.totalSupply)
      );
    }
    return 0;
  };

  const getProgress = (contract_id) => {
    if (loading || !data) {
      return 0;
    }

    const chosenTalent = data.talentTokens.find(
      (element) => element.id == contract_id.toLowerCase()
    );

    if (chosenTalent) {
      const value = ethers.BigNumber.from(chosenTalent.totalSupply)
        .mul(100)
        .div(chosenTalent.maxSupply)
        .toNumber();

      if (value < 1) {
        return 1;
      } else {
        return value;
      }
    }
    return 0;
  };

  const compareUsername = (talent1, talent2) => {
    if (talent1.username > talent2.username) {
      return 1;
    } else if (talent1.username < talent2.username) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareOccupation = (talent1, talent2) => {
    if (talent1.occupation < talent2.occupation) {
      return 1;
    } else if (talent1.occupation > talent2.occupation) {
      return -1;
    } else {
      return 0;
    }
  };

  const compareSupporters = (talent1, talent2) =>
    getSupporterCount(talent1.contract_id) -
    getSupporterCount(talent2.contract_id);

  const compareCirculatingSupply = (talent1, talent2) => {
    const talent1Amount = ethers.utils.parseUnits(
      getCirculatingSupply(talent1.contract_id).replaceAll(",", "")
    );
    const talent2Amount = ethers.utils.parseUnits(
      getCirculatingSupply(talent2.contract_id).replaceAll(",", "")
    );

    if (talent1Amount.gt(talent2Amount)) {
      return 1;
    } else if (talent1Amount.lt(talent2Amount)) {
      return -1;
    } else {
      return 0;
    }
  };

  const filteredTalents = () => {
    let desiredTalent = talents;
    if (watchlistOnly) {
      desiredTalent = talents.filter((talent) => !!follows[talent.id]);
    }
    let comparisonFunction;

    switch (selectedSort) {
      case "Supporters":
        comparisonFunction = compareSupporters;
        break;
      case "Occupation":
        comparisonFunction = compareOccupation;
        break;
      case "Circulating Supply":
        comparisonFunction = compareCirculatingSupply;
        break;
      case "Alphabetical Order":
        comparisonFunction = compareUsername;
        break;
    }
    desiredTalent.sort(comparisonFunction);

    if (sortDirection != "asc") {
      desiredTalent.reverse();
    }

    return desiredTalent;
  };

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

  const getSelectedOptionValue = (talent) => {
    switch (selectedSort) {
      case "Supporters":
        return getSupporterCount(talent.contract_id);
      case "Occupation":
        return talent.occupation;
      case "Circulating Supply":
        return getCirculatingSupply(talent.contract_id);
      case "Alphabetical Order":
        return talent.occupation;
    }
  };

  const sortIcon = (option) => {
    if (option == selectedSort) {
      return sortDirection == "asc" ? " ▼" : " ▲";
    } else {
      return "";
    }
  };

  if (width < 992) {
    return (
      <div className="pl-4">
        <MobileTalentTableDropdown
          show={showDropdown}
          hide={() => setShowDropdown(false)}
          mode={theme.mode()}
          selectedOption={selectedSort}
          order={sortDirection}
          onOptionClick={onOptionClick}
        />
        <div className="w-100 talent-table-tabs mt-3 d-flex flex-row align-items-center">
          <div
            onClick={() => setWatchlistOnly(false)}
            className={`talent-table-tab${
              !watchlistOnly ? " active-talent-table-tab" : ""
            }`}
          >
            All Active Talent
          </div>
          <div
            onClick={() => setWatchlistOnly(true)}
            className={`talent-table-tab${
              watchlistOnly ? " active-talent-table-tab" : ""
            }`}
          >
            Watchlist
          </div>
          <Button
            onClick={() => setShowDropdown(true)}
            type="white-ghost"
            mode={theme.mode()}
            className="ml-auto mr-3"
          >
            {selectedSort} <OrderBy black={true} />
          </Button>
        </div>
        <Table mode={theme.mode()} className="horizontal-scroll">
          <Table.Body>
            {filteredTalents().map((talent) => (
              <Table.Tr
                key={`talent-${talent.contract_id}`}
                onClick={() =>
                  (window.location.href = `/talent/${talent.username}`)
                }
              >
                <Table.Td>
                  <div className="d-flex flex-row align-items-center">
                    <button
                      className="btn border-0 text-warning"
                      onClick={() => toggleWatchlist(talent)}
                      disabled={changingFollow}
                    >
                      {follows[talent.id] ? (
                        <FontAwesomeIcon icon={faStar} />
                      ) : (
                        <FontAwesomeIcon icon={faStarOutline} />
                      )}
                    </button>
                    <TalentProfilePicture
                      src={talent.profilePictureUrl}
                      height="24"
                    />
                    <P2 text={talent.username} bold className="ml-2" />
                  </div>
                </Table.Td>
                <Table.Td className="text-right pr-3">
                  <P2 text={getSelectedOptionValue(talent)} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }

  return (
    <>
      <div className="w-100 talent-table-tabs mt-3 d-flex flex-row">
        <div
          onClick={() => setWatchlistOnly(false)}
          className={`talent-table-tab${
            !watchlistOnly ? " active-talent-table-tab" : ""
          }`}
        >
          All Active Talent
        </div>
        <div
          onClick={() => setWatchlistOnly(true)}
          className={`talent-table-tab${
            watchlistOnly ? " active-talent-table-tab" : ""
          }`}
        >
          Watchlist
        </div>
      </div>
      <Table mode={theme.mode()} className="px-3 horizontal-scroll">
        <Table.Head>
          <Table.Th>
            <Caption bold text="" />
          </Table.Th>
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
              onClick={() => onOptionClick("Occupation")}
              bold
              text={`OCCUPATION${sortIcon("Occupation")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Supporters")}
              bold
              text={`SUPPORTERS${sortIcon("Supporters")}`}
              className="cursor-pointer"
            />
          </Table.Th>
          <Table.Th>
            <Caption
              onClick={() => onOptionClick("Circulating Supply")}
              bold
              text={`CIRCULATING SUPPLY${sortIcon("Circulating Supply")}`}
              className="cursor-pointer"
            />
          </Table.Th>
        </Table.Head>
        <Table.Body>
          {filteredTalents().map((talent) => (
            <Table.Tr
              key={`talent-${talent.contract_id}`}
              onClick={() =>
                (window.location.href = `/talent/${talent.username}`)
              }
            >
              <Table.Td>
                <button
                  className="btn border-0 text-warning"
                  onClick={() => toggleWatchlist(talent)}
                  disabled={changingFollow}
                >
                  {follows[talent.id] ? (
                    <FontAwesomeIcon icon={faStar} />
                  ) : (
                    <FontAwesomeIcon icon={faStarOutline} />
                  )}
                </button>
              </Table.Td>
              <Table.Td>
                <div className="d-flex">
                  <TalentProfilePicture
                    src={talent.profilePictureUrl}
                    height="24"
                  />
                  <P2 text={talent.username} bold className="ml-2" />
                </div>
              </Table.Td>
              <Table.Td>
                <P2 text={talent.occupation} />
              </Table.Td>
              <Table.Td>
                <P2 text={`${getSupporterCount(talent.contract_id)}`} />
              </Table.Td>
              <Table.Td className="pr-3">
                <P2
                  text={`${getCirculatingSupply(talent.contract_id)} ${
                    talent.ticker
                  }`}
                />
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className="progress-bar bg-secondary"
                    role="progressbar"
                    aria-valuenow={getProgress(talent.contract_id)}
                    style={{ width: `${getProgress(talent.contract_id)}%` }}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default (props, railsContext) => {
  return () => (
    <ThemeContainer {...props}>
      <ApolloProvider client={client(railsContext.contractsEnv)}>
        <TalentTable {...props} />
      </ApolloProvider>
    </ThemeContainer>
  );
};

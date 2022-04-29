import React from "react";
import { ethers } from "ethers";
import currency from "currency.js";
import Modal from "react-bootstrap/Modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseAndCommify } from "src/onchain/utils";
import ClaimRewardsDropdown from "../../design_system/dropdowns/claim_rewards_dropdown";
import Divider from "../../design_system/other/Divider";
import P1 from "../../design_system/typography/p1";
import P2 from "../../design_system/typography/p2";
import P3 from "../../design_system/typography/p3";
import Button from "../../design_system/button";
import { useWindowDimensionsHook } from "../../../utils/window";
import { ArrowLeft } from "../../icons";

const RewardsModal = ({
  show,
  setShow,
  claim,
  loadingRewards,
  activeContract,
  rewardValues,
  supportedTalents,
  mode,
}) => {
  if (!activeContract) {
    return null;
  }
  const { width } = useWindowDimensionsHook();
  const mobile = width < 992;
  const availableRewards = rewardValues[activeContract] || "0";
  const activeTalent =
    supportedTalents.find(
      (talent) => talent.contract_id == activeContract.toLowerCase()
    ) || {};
  const loadAvailableSupply = ethers.utils.formatUnits(
    parseInt(activeTalent.totalSupply) || 0
  );

  return (
    <Modal
      scrollable={true}
      show={show}
      centered={mobile ? false : true}
      onHide={() => setShow(false)}
      dialogClassName={
        mobile ? "mw-100 mh-100 m-0" : "remove-background rewards-modal"
      }
      fullscreen={"md-down"}
    >
      <Modal.Header closeButton className="pt-4 px-4 pb-0">
        {mobile && (
          <button
            onClick={() => setShow(false)}
            className="text-black remove-background remove-border mr-3"
          >
            <ArrowLeft color="currentColor" />
          </button>
        )}
        <P1 className="text-black" text="Claim rewards" bold />
      </Modal.Header>
      <Modal.Body className="show-grid px-4 pb-4 d-flex flex-column justify-content-between">
        <P2
          className="mb-6"
          text="Rewards are calculated in real time and are always displayed in $TAL."
          mode={mode}
        />
        <P2 className="text-black mb-2" text="Claim method" bold />
        <ClaimRewardsDropdown
          mode={mode}
          talentSymbol={activeTalent.symbol}
          className="mb-2"
        />
        <P2
          className="text-primary-04"
          text="This will use all your accumulated rewards. If no more talent tokens can
          be minted the leftover amount will be returned to you."
        />
        <Divider mode={mode} className="mt-6 mb-3" />
        <div className="d-flex justify-content-between mb-2">
          <P2 className="text-gray-300" text="Unclaimed Rewards" />
          <P2
            className="text-right text-black"
            text={`${parseAndCommify(availableRewards)} $TAL`}
          />
        </div>
        <div className="d-flex justify-content-between">
          <P2
            className="text-gray-300"
            text={`$${activeTalent.symbol} Unclaimed Price`}
          />
          <P2 className="text-right text-black" text="$0.1" />
        </div>
        <Divider mode={mode} className="mt-3 mb-3" />
        <div className="d-flex justify-content-between">
          <P1 className="text-black" text="You will receive" bold />
          <P1
            className="text-black"
            text={`${parseAndCommify(availableRewards / 5)} $${
              activeTalent.symbol
            }`}
            bold
          />
        </div>
        <Divider mode={mode} className="mt-3 mb-3" />
        <P3
          className="text-gray-300 mb-6"
          text={`$${activeTalent.symbol} tokens still available: ${currency(
            loadAvailableSupply
          )
            .format()
            .substring(1)}`}
        />
        <Button
          className="w-100"
          type="primary-default"
          size="big"
          onClick={claim}
          disabled={loadingRewards}
        >
          Buy ${activeTalent.symbol}{" "}
          {loadingRewards ? <FontAwesomeIcon icon={faSpinner} spin /> : ""}
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default RewardsModal;

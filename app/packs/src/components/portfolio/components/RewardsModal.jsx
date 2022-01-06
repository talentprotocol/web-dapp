import React from "react";
import Modal from "react-bootstrap/Modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseAndCommify } from "src/onchain/utils";

const RewardsModal = ({
  show,
  setShow,
  claim,
  loadingRewards,
  activeContract,
  rewardValues,
  supportedTalents,
}) => {
  if (!activeContract) {
    return null;
  }
  const availableRewards = rewardValues[activeContract] || "0";
  const activeTalent =
    supportedTalents.find(
      (talent) => talent.contract_id == activeContract.toLowerCase()
    ) || {};

  return (
    <Modal
      scrollable={true}
      show={show}
      centered
      onHide={() => setShow(false)}
      dialogClassName="remove-background"
    >
      <Modal.Body className="show-grid p-4">
        <p>
          <strong className="text-black">
            Claim rewards {activeTalent.symbol}
          </strong>
        </p>
        <p className="text-black">
          Rewards are calculated in real time and are always displayed in $TAL.
        </p>
        <p className="text-black">Claim method</p>
        <p className="text-black">
          You currently have{" "}
          <strong>{parseAndCommify(availableRewards)} $TAL</strong> accumulated.
        </p>
        <div className="dropdown-divider mt-5 mb-3"></div>
        <div className="d-flex flex-row flex-wrap w-100">
          <div className="d-flex flex-column col-12 col-md-6 justify-content-between ">
            <p className="mr-3 mb-0 text-black">Claim rewards to my wallet.</p>
            <p className="text-muted">
              <small>
                You'll be able to cash out your $TAL rewards to your Metamask
                wallet once we launch the $TAL token next year (subject to flow
                controls). Until then you can see your $TAL balance in your
                Portfolio.
              </small>
            </p>
            <button className="btn btn-primary talent-button" disabled>
              Claim $TAL
            </button>
          </div>
          <div className="dropdown-divider col-12 my-3 d-md-none"></div>
          <div className="d-flex flex-column col-12 col-md-6 justify-content-between">
            <div className="d-flex flex-column mr-3">
              <p className="mb-0 text-black">
                Use my rewards to buy more talent tokens.
              </p>
              <p className="text-muted">
                <small>
                  This will use all your accumulated rewards. If no more talent
                  tokens can be minted the leftover amount will be returned to
                  you.
                </small>
              </p>
            </div>
            <button
              className="btn btn-primary talent-button"
              onClick={claim}
              disabled={loadingRewards}
            >
              Buy ${activeTalent.symbol}{" "}
              {loadingRewards ? <FontAwesomeIcon icon={faSpinner} spin /> : ""}
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RewardsModal;

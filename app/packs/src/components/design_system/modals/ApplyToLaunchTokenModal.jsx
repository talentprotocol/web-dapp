import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "src/components/design_system/button";
import { useWindowDimensionsHook } from "src/utils/window";
import { patch } from "src/utils/requests";
import { H5, P2 } from "src/components/design_system/typography";
import { Alert } from "src/components/icons";

const ApplyToLaunchTokenModal = ({ show, hide, investorId, username }) => {
  const { mobile } = useWindowDimensionsHook();

  const upgradeToTalent = () => {
    patch(`/api/v1/supporters/${investorId}/upgrade_profile_to_talent`)
      .then(() => window.location.replace(`/u/${username}/edit_profile`))
      .catch((e) => console.log("error", e));
  };

  return (
    <Modal
      scrollable={true}
      show={show}
      onHide={hide}
      centered
      dialogClassName={mobile ? "mw-100 mh-100 m-0" : "remove-background"}
      contentClassName={mobile ? "h-100" : ""}
      fullscreen="true"
    >
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body className="d-flex flex-column align-items-center justify-content-between p-4">
        {mobile && <div></div>}
        <div className="text-center">
          <Alert width={40} height={40} />
          <H5
            className="text-black mt-4 mb-1"
            bold
            text="Apply to launch your Talent Token"
          />
          <P2
            className="text-primary-03 text-center"
            text="Launching your token requires an application and validation by the community.
            It's important that all talents are a good fit with the platform and motivated to participate.
            By clicking “Let's do this” your profile will have additional information you'll need to fill out to apply."
          />
        </div>
        <div className="d-flex mt-6 w-100">
          <Button
            className="mr-2 w-100"
            onClick={hide}
            text="Cancel"
            type="white-subtle"
            size="big"
          />
          <Button
            className="w-100"
            onClick={upgradeToTalent}
            text="Let's do this!"
            type="primary-default"
            size="big"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyToLaunchTokenModal;

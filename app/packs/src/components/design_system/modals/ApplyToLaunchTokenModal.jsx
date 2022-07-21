import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "src/components/design_system/button";
import LoadingButton from "src/components/button/LoadingButton";
import { useWindowDimensionsHook } from "src/utils/window";
import { patch } from "src/utils/requests";
import { H5, P2 } from "src/components/design_system/typography";
import { Alert } from "src/components/icons";

const ApplyToLaunchTokenModal = ({ show, hide, investorId, username }) => {
  const [loading, setLoading] = useState(false);
  const { mobile } = useWindowDimensionsHook();

  const upgradeToTalent = () => {
    setLoading(true);
    patch(`/api/v1/supporters/${investorId}/upgrade_profile_to_talent`)
      .then(() => window.location.replace(`/u/${username}/edit_profile`))
      .catch((e) => console.log("error", e))
      .finally(() => setLoading(false));
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
          <LoadingButton
            className="w-100"
            onClick={upgradeToTalent}
            type="primary-default"
            size="big"
            loading={loading}
          >
            Let's do this!
          </LoadingButton>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ApplyToLaunchTokenModal;

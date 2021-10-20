import React, { useState, useEffect } from "react";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import Modal from "react-bootstrap/Modal";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { patch, getAuthToken } from "src/utils/requests";
import Button from "../button";


const uppy = new Uppy({
  meta: { type: "avatar" },
  restrictions: { maxNumberOfFiles: 1 },
  autoProceed: true,
});

uppy.use(AwsS3Multipart, {
  limit: 4,
  companionUrl: "/",
  companionHeaders: {
    "X-CSRF-Token": getAuthToken(),
  },
});

const EditInvestorProfilePicture = ({ investorId, show, setShow }) => {
  const [uploadingFileS3, setUploadingFileS3] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [uploadedFileData, setUploadedFileData] = useState(null);

  const handleCancel = (e) => {
    e.preventDefault();
    setShow(false);
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const response = await patch(`/api/v1/investor/${investorId}`, {
      investor: {
        profile_picture: uploadedFileData,
      },
    }).catch(() => {
      setError(true);
      setSaving(false);
    });

    if (response) {
      if (response.error) {
        setError(true);
      } else {
        setUploadedFileData(null);
        setShow(false);
      }
    }
    setSaving(false);
  };

  useEffect(() => {
    uppy.on("upload-success", (file, response) => {
      setUploadedFileData({
        id: response.uploadURL.match(/\/cache\/([^\?]+)/)[1], // extract key without prefix
        storage: "cache",
        metadata: {
          size: file.size,
          filename: file.name,
          mime_type: file.type,
        },
      });
      setUploadingFileS3(false);
    });
    uppy.on("upload", () => {
      setUploadingFileS3(true);
    });
  }, []);

  return (
      <Modal
        size="sm"
        fullscreen={"md-down"}
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Body className="show-grid py-0">
          <div className="container-fluid">
            <form>
              <div className="form-group">
                <label className="mr-1 my-2">Profile picture</label>
                {uploadingFileS3 && (
                  <p>
                    <FontAwesomeIcon icon={faSpinner} spin /> Uploading...
                  </p>
                )}
                {!uploadingFileS3 && uploadedFileData !== null && (
                  <p>Uploaded file. </p>
                )}
                {!uploadingFileS3 && uploadedFileData === null && (
                  <DragDrop
                    uppy={uppy}
                    locale={{
                      strings: {
                        dropHereOr: "Drop here or %{browse}",
                        browse: "browse",
                      },
                    }}
                  />
                )}
              </div>
              {error && (
                <p className="text-danger">
                  We had some trouble updating your profile. Reach out to us if this
                  persists.
                </p>
              )}
              <div className="mb-2 d-flex flex-row-reverse align-items-end justify-content-between">
                <button
                  disabled={saving}
                  onClick={handleSave}
                  className="btn btn-primary talent-button"
                >
                  {saving ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
                <Button type="secondary" text="Cancel" onClick={handleCancel} />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
  );
};

export default EditInvestorProfilePicture;

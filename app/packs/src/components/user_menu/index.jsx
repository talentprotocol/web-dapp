import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import TalentProfilePicture from "../talent/TalentProfilePicture";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MetamaskConnect from "../login/MetamaskConnect";
import { destroy } from "../../utils/requests";
import EditInvestorProfilePicture from "./EditInvestorProfilePicture";

const UserMenu = ({ user, signOutPath }) => {
  const [show, setShow] = useState(false);

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(user.walletId)
  };

  const signOut = () => {
    destroy(signOutPath).then(() => {
      window.location.replace("/");
    })
  };

  return (
    <>
      <Dropdown className="">
        <Dropdown.Toggle className="user-menu-dropdown-btn no-caret" id="user-dropdown">
          <TalentProfilePicture
            src={user.profilePictureUrl}
            height={20}
            className="mr-2"
          />
          <small className="mr-2">{user.username}</small>
          <FontAwesomeIcon icon={faAngleDown} />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item
            key="tab-dropdown-address"
            onClick={copyAddressToClipboard}
          >
            <small className="text-black">Address: </small>
            <small className="text-secondary">{user.displayWalletId}</small>
            <FontAwesomeIcon icon={faCopy} />
          </Dropdown.Item>
          <Dropdown.Item
            key="tab-dropdown-get-funds"
            className="text-black"
            disabled
          >
            <small>Get funds</small>
          </Dropdown.Item>
          {user.isTalent ?
            <Dropdown.Item
              key="tab-dropdown-my-profile"
              className="text-black"
              href={`/talent/${user.talentId}`}
            >
              <small>My profile</small>
            </Dropdown.Item> :
            <Dropdown.Item
              key="tab-dropdown-change-investor-image"
              className="text-black"
              onClick={() => setShow(true)}
            >
              <small>Change profile picture</small>
            </Dropdown.Item>
          }
          <Dropdown.Item
            key="tab-dropdown-sign-out"
            onClick={signOut}
            className="text-black"
          >
            <small>Sign out</small>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item
            key="tab-dropdown-connect-wallet"
          >
            <MetamaskConnect user_id={user.id}/>
          </Dropdown.Item>
          <Dropdown.Divider />
        </Dropdown.Menu>
      </Dropdown>
      <EditInvestorProfilePicture
        show={show}
        setShow={setShow}
        investorId={user.investorId}
      />
    </>
  );
};

export default UserMenu;

import React, { useState, useCallback, useEffect } from "react";

import { TalWeb3 } from "src/taljs";
import { patch } from "src/utils/requests";

import Button from "../button";

const DeployTokenButton = ({
  ticker,
  username,
  address,
  reserveRatio,
  talentFee,
  updateTokenUrl,
  contract_id,
  wallet_id,
}) => {
  const [buttonText, setButtonText] = useState("Deploy Token");
  const [mintText, setMintText] = useState("Initial Mint");
  const [transferText, setTransferText] = useState("Transfer $TAL");
  const [tokenAddress, setTokenAddress] = useState(contract_id);
  const [talweb3, setTalweb3] = useState();

  const setupTal = useCallback(async () => {
    const web3 = new TalWeb3();
    await web3.initialize();
    setTalweb3(web3);
  }, []);

  useEffect(() => {
    setupTal();
  }, [setupTal]);

  const onClick = async (e) => {
    e.preventDefault();

    setButtonText("Deploying Token...");

    const result = await talweb3.talentTokens.createNewToken(
      ticker,
      username,
      reserveRatio,
      address,
      talentFee
    );
    if (result) {
      const contractAddress =
        result.events.TalentAdded.returnValues.contractAddress;
      setTokenAddress(contractAddress);

      const response = await patch(`${updateTokenUrl}.json`, {
        token: { contract_id: contractAddress.toLowerCase(), deployed: true },
      });
      if (response.error) {
        setButtonText("Error updating contract ID");
      } else {
        setButtonText("Deployed Token");
      }
    } else {
      setButtonText("Unable to create new talent token");
    }
  };

  const performInitialMint = async (e) => {
    e.preventDefault();

    const token = await talweb3.talentTokens.getTalentToken(
      tokenAddress,
      false
    );
    if (token) {
      const result = await token.initialMint();

      if (result) {
        setMintText("Minted token");
      } else {
        setMintText("Unabled to mint");
      }
    } else {
      setMintText("Token doesn't exist");
    }
  };

  const transfer = async (e) => {
    e.preventDefault();

    const result = await talweb3.tal.transfer(wallet_id, 150000);

    if (result) {
      setTransferText("Transfered Funds");
    } else {
      setTransferText("Unabled to transfer funds");
    }
  };

  const invalidContract = () => tokenAddress === null || tokenAddress == "";

  return (
    <div className="d-flex flex-row justify-content-between">
      <Button
        disabled={
          reserveRatio === null ||
          talentFee === null ||
          buttonText != "Deploy Token"
        }
        type="warning"
        text={buttonText}
        onClick={onClick}
        className="btn btn-warning talent-button mr-2"
      />
      <Button
        disabled={invalidContract() || mintText != "Initial Mint"}
        type="danger"
        text={mintText}
        onClick={performInitialMint}
        className="btn btn-danger talent-button mr-2"
      />
      <Button
        disabled={wallet_id === null || transferText != "Transfer $TAL"}
        type="primary"
        text={transferText}
        onClick={transfer}
        className="btn btn-primary talent-button mr-2"
      />
    </div>
  );
};

export default DeployTokenButton;

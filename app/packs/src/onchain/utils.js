import { ethers } from "ethers";

export const parseAndCommify = (value, nrOfDecimals = 2) => {
  return ethers.utils.commify(parseFloat(value).toFixed(nrOfDecimals));
};

export const ipfsToURL = (ipfsAddress) => {
  return "https://ipfs.io/" + ipfsAddress.replace("://", "/");
};

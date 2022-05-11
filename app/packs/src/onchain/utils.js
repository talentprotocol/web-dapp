import { ethers } from "ethers";
import Addresses from "./addresses.json";

export const parseAndCommify = (value, nrOfDecimals = 2) => {
  return ethers.utils.commify(parseFloat(value).toFixed(nrOfDecimals));
};

export const ipfsToURL = (ipfsAddress) => {
  return "https://ipfs.io/" + ipfsAddress.replace("://", "/");
};

export const chainIdToName = (chainId, env) => {
  return Addresses[env][chainId].chainName;
};

export const chainNameToId = (chainName, env) => {
  const chainId = Object.keys(Addresses[env]).filter(
    (item) => Addresses[env][item].chainName == chainName
  );

  if (chainId.length == 0) {
    return undefined;
  }

  return Addresses[env][chainId[0]].chainId;
};

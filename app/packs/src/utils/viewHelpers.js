import { ethers } from "ethers";
import { parseAndCommify } from "src/onchain/utils";

export const shortenAddress = (address) => {
  return `${address.substring(0, 5)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};

export const getSupporterCount = (supporterCounter) => {
  if (supporterCounter) {
    return ethers.utils.commify(supporterCounter);
  }
  return "-1";
};

export const getMarketCap = (totalSupply) => {
  if (totalSupply) {
    const totalSupplyBigNum = ethers.BigNumber.from(totalSupply);
    const formattedTotalSupply = ethers.utils.formatUnits(totalSupplyBigNum);
    return parseAndCommify(formattedTotalSupply * 0.1);
  }
  return "-1";
};

export const getProgress = (totalSupply, maxSupply) => {
  const value = ethers.BigNumber.from(totalSupply)
    .mul(100)
    .div(ethers.BigNumber.from(maxSupply))
    .toNumber();

  if (value < 1) {
    return 1;
  } else {
    return value;
  }
};

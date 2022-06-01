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
    const formattedTotalSupply = ethers.utils.formatUnits(totalSupply);

    return parseAndCommify(formattedTotalSupply * 0.1);
  }
  return "-1";
};

export const getProgress = (totalSupply, maxSupply) => {
  const value = ethers.BigNumber.from(totalSupply)
    .mul(100)
    .div(maxSupply)
    .toNumber();

  if (value < 1) {
    return 1;
  } else {
    return value;
  }
};

export const getMarketCapVariance = (
  tokenDayData,
  deployDate,
  startDate,
  totalSupply
) => {

  if (startDate < deployDate) {
    return 0;
  } else if (tokenDayData[0]) {
      const startSupply = parseFloat(ethers.utils.formatUnits(tokenDayData[0].dailySupply));
      const lastSupply = parseFloat(ethers.utils.formatUnits(totalSupply));
      const variance = (startSupply - lastSupply) / lastSupply;
      return `${variance < 0 ? '-' : '+'}${parseAndCommify(variance)}%`
  } else {
    return 0;
  }
};

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
  endDate,
  totalSupply
) => {
  if (startDate < deployDate) {
    return "0%";
  } else if (tokenDayData[0]) {
    const startSupply = parseFloat(
      ethers.utils.formatUnits(tokenDayData[0].dailySupply)
    );
    const lastSupply = parseFloat(ethers.utils.formatUnits(totalSupply));
    const variance = (lastSupply - startSupply) / startSupply;
    return `${variance < 0 ? "" : "+"}${parseAndCommify(variance)}%`;
  } else {
    return "0%";
  }

  tokenDayData.forEach((data) => {
    dayData[data.date] = parseFloat(ethers.utils.formatUnits(data.dailySupply));
  });

  for (let date = startDate, i = 0; date < endDate; date += dayInSeconds) {
    if (date < deployDate) {
      supplies.push(0);
    } else if (dayData[date]) {
      supplies.push(dayData[date]);
    } else if (i == 0) {
      supplies.push(parseFloat(ethers.utils.formatUnits(totalSupply)));
    } else {
      supplies.push(supplies[i - 1]);
    }
    i++;
  }
  const totalDailySupply = supplies.reduce((prev, current) => prev + current, 0);
  const mean = totalDailySupply / supplies.length;

  const sumForVariance = supplies.reduce(
    (prev, current) => prev + Math.pow(current - mean, 2),
    0
  );
  const variance = sumForVariance / supplies.length;
  const marketCapVariance = parseAndCommify(variance * 0.1);
  return marketCapVariance;
};

export const getStartDateForVariance = () => {
  const varianceDays = 1;
  const msDividend = 1000;
  const dayInSeconds = 86400;
  const currentDate = new Date();
  const endDate =
    Date.UTC(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth(),
      currentDate.getUTCDate(),
      0,
      0,
      0
    ) / msDividend;
  const startDate = endDate - varianceDays * dayInSeconds;
  return startDate;
};

export const getUTCDate = (date) => {
  const msDividend = 1000;
  const deployDate = new Date(date);
  const deployDateUTC =
    Date.UTC(
      deployDate.getUTCFullYear(),
      deployDate.getUTCMonth(),
      deployDate.getUTCDate(),
      0,
      0,
      0
    ) / msDividend;

  return deployDateUTC;
};

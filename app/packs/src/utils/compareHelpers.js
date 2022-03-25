import dayjs from "dayjs";

export const compareStrings = (string1, string2) => {
  const name1 = string1?.toLowerCase() || "";
  const name2 = string2?.toLowerCase() || "";

  if (name1 < name2) {
    return -1;
  } else if (name1 > name2) {
    return 1;
  } else {
    return 0;
  }
};

export const compareNumbers = (number1, number2) => {
  return number1 - number2;
};

export const compareDates = (date1, date2) => {
  const firstDate = dayjs(date1);
  const secondDate = dayjs(date2);

  if (firstDate.unix() < secondDate.unix()) {
    return -1;
  } else if (firstDate.unix() > secondDate.unix()) {
    return 1;
  } else {
    return 0;
  }
};

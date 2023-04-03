import format from "date-fns/format";

export const addDays = (date: Date, days: number) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const interval = (x: number, y: number) => {
  let result = [];
  let i = x;
  while (i <= y) {
    result.push(i);
    i++;
  }
  return result;
};

export const getHours = (date: Date, xInterval: number, yInterval: number) => {
  let today = new Date();
  let currentHour = date.getHours();

  let hours = interval(xInterval, yInterval);
  if (today.toDateString() === date.toDateString()) {
    hours = hours.filter((h: number) => h >= currentHour);
  }

  return hours;
};

export const getUTCString = (date: Date | null) => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd");
};

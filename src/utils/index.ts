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

export const getHours = (date: Date) => {
  let today = new Date();
  let currentHour = date.getHours();

  let hours = interval(8, 23);
  if (today.toDateString() === date.toDateString()) {
    hours = hours.filter((h: number) => h >= currentHour);
  }

  return hours;
};

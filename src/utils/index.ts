export const addDays = (date: Date, days: number) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getHours = (date: Date) => {
  return [18, 19, 20, 21, 22, 23];
};

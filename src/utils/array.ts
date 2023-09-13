export const sumValuesFromArrayOfObjects = (array: any[], key: string) => {
  return array.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr[key]), 0);
};

export const sumValuesFromArrayOfObjects = (
  array: any[],
  qtdKey: string,
  valueKey: string
) => {
  return array.reduce(
    (acc, curr) =>
      parseFloat(acc) + parseInt(curr[qtdKey]) * parseFloat(curr[valueKey]),
    0
  );
};

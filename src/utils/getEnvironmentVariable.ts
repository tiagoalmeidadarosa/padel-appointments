const getEnvironmentVariable = (environmentVariable: string) => {
  return process.env[environmentVariable] as string;
};

export default getEnvironmentVariable;

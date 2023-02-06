const getEnvironmentVariable = (environmentVariable: string) => {
  console.error(process.env);
  return process.env[environmentVariable] as string;
};

export default getEnvironmentVariable;

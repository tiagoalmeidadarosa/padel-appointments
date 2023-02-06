const getEnvironmentVariable = (environmentVariable: string) => {
  console.log(process.env);
  return process.env[environmentVariable] as string;
};

export default getEnvironmentVariable;

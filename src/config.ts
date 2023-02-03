import getEnvironmentVariable from "./utils/getEnvironmentVariable";

export const appointmentsApiUrl =
  getEnvironmentVariable("APPOINTMENTS_API_URL") || "https://localhost:7040";

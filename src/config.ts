import getEnvironmentVariable from "./utils/getEnvironmentVariable";

export const appointmentsApiUrl =
  getEnvironmentVariable("NEXT_PUBLIC_APPOINTMENTS_API_URL") ||
  "https://localhost:7040";

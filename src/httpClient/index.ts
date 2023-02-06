import qs from "qs";
import axios from "axios";
import { appointmentsApiUrl } from "../config";

alert(process.env);
alert(appointmentsApiUrl);

export const httpClient = axios.create({
  baseURL: appointmentsApiUrl,
  headers: { "Content-Type": "application/json" },
  //withCredentials: true,
  paramsSerializer: {
    encode: (params) => qs.stringify(params, { indices: false }),
  },
});

httpClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    console.error(error?.response);
    return Promise.reject(error);
  }
);

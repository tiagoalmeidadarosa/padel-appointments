import qs from "qs";
import axios from "axios";
import { appointmentsApiUrl } from "../config";
import { getSession } from "next-auth/react";

export const httpClient = axios.create({
  baseURL: appointmentsApiUrl,
  headers: { "Content-Type": "application/json" },
  //withCredentials: true,
  paramsSerializer: {
    encode: (params) => qs.stringify(params, { indices: false }),
  },
});

httpClient.interceptors.request.use(async (request) => {
  const session = await getSession();
  if (session) {
    // @ts-ignore
    request.headers.Authorization = `Bearer ${session.apiToken}`;
  }
  return request;
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

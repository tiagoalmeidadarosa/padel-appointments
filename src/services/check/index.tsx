import { httpClient } from "@/httpClient";
import {
  CheckRequest
} from "./interfaces";

export class CheckService {
  static updateCheck(
    checkId: number,
    checkRequest: CheckRequest
  ) {
    return httpClient.put(`/checks/${checkId}`, checkRequest);
  }
}

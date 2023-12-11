import { httpClient } from "@/httpClient";
import {
  CheckRequest
} from "@/shared/interfaces";

export class CheckService {
  static updateCheck(
    checkId: number,
    checkRequest: CheckRequest
  ) {
    return httpClient.put(`/checks/${checkId}`, checkRequest);
  }
}

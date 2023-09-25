import { httpClient } from "@/httpClient";
import { Court } from "./interfaces";

export class CourtService {
  static getCourts() {
    return httpClient.get<Court[]>(`/courts`);
  }
}

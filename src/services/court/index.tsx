import { httpClient } from "@/httpClient";
import { Court } from "@/shared/interfaces";;

export class CourtService {
  static getCourts() {
    return httpClient.get<Court[]>(`/api/courts`);
  }
}

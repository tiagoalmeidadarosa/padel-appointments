import { httpClient } from "@/httpClient";
import { Agenda } from "@/shared/interfaces";;

export class AgendaService {
  static getAgendas() {
    return httpClient.get<Agenda[]>(`/api/agendas`);
  }
}

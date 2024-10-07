import { httpClient } from "@/httpClient";
import {
  Agenda,
  AgendaRequest,
  Schedule,
  UpdateAgendaRequest,
} from "@/shared/interfaces";

export class AgendaService {
  static getAgendas() {
    return httpClient.get<Agenda[]>(`/api/agendas`);
  }

  static getSchedules(agendaId: number, date: string) {
    return httpClient.get<Schedule[]>(
      `/api/agendas/${agendaId}/schedules?date=${date}`
    );
  }

  static addAgenda(agendaRequest: AgendaRequest) {
    return httpClient.post(`/api/agendas`, agendaRequest);
  }

  static updateAgenda(agendaId: number, updateRequest: UpdateAgendaRequest) {
    return httpClient.put(`/api/agendas/${agendaId}`, updateRequest);
  }

  static deleteAgenda(agendaId: number) {
    return httpClient.delete(`/api/agendas/${agendaId}`);
  }
}

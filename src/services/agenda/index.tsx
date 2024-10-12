import { httpClient } from "@/httpClient";
import { Agenda, Schedule } from "@/shared/interfaces";

export class AgendaService {
  static getAgendas() {
    return httpClient.get<Agenda[]>(`/api/agendas`);
  }

  static getSchedules(agendaId: number, date: string) {
    return httpClient.get<Schedule[]>(
      `/api/agendas/${agendaId}/schedules?date=${date}`
    );
  }

  static addAgenda(agenda: Agenda | null) {
    return httpClient.post(`/api/agendas`, {
      name: agenda?.name,
      startsAt: agenda?.startsAt,
      endsAt: agenda?.endsAt,
      interval: agenda?.interval,
    });
  }

  static updateAgenda(agenda: Agenda) {
    return httpClient.put(`/api/agendas/${agenda.id}`, {
      name: agenda.name,
      startsAt: agenda.startsAt,
      endsAt: agenda.endsAt,
      interval: agenda.interval,
    });
  }

  static deleteAgenda(agendaId: number) {
    return httpClient.delete(`/api/agendas/${agendaId}`);
  }
}

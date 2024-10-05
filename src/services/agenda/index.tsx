import { httpClient } from "@/httpClient";
import { Agenda, Schedule } from "@/shared/interfaces";;

export class AgendaService {
  static getAgendas() {
    return httpClient.get<Agenda[]>(`/api/agendas`);
  }

  static getSchedules(agendaId: number, date: string) {
    return httpClient.get<Schedule[]>(
      `/api/agendas/${agendaId}/schedules?date=${date}`
    );
  }

  static addAgenda(/*appointmentRequest: AppointmentRequest*/) {
    // return httpClient.post(`/api/agendas`, appointmentRequest);
  }

  static updateAgenda(
    agendaId: number,
    // updateRequest: UpdateAppointmentRequest
  ) {
    // return httpClient.put(`/api/agendas/${agendaId}`, updateRequest);
  }
}

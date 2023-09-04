import { httpClient } from "@/httpClient";
import {
  AppointmentRequest,
  Schedule,
  UpdateAppointmentRequest,
} from "./interfaces";

export class AppointmentService {
  static getSchedules(courtId: number, date: string) {
    return httpClient.get<Schedule[]>(
      `/courts/${courtId}/schedules?date=${date}`
    );
  }

  static addAppointment(appointmentRequest: AppointmentRequest) {
    return httpClient.post(`/appointments`, appointmentRequest);
  }

  static updateAppointment(
    appointmentId: number,
    updateRequest: UpdateAppointmentRequest
  ) {
    return httpClient.put(`/appointments/${appointmentId}`, updateRequest);
  }

  static deleteAppointment(
    appointmentId: number,
    scheduleId: number,
    removeRecurrence: boolean
  ) {
    return httpClient.delete(
      `/appointments/${appointmentId}/schedules/${scheduleId}?removeRecurrence=${removeRecurrence}`
    );
  }
}

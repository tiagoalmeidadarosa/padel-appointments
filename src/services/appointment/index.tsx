import { httpClient } from "@/httpClient";
import { AppointmentRequest, UpdateAppointmentRequest } from "@/shared/interfaces";

export class AppointmentService {
  static addAppointment(appointmentRequest: AppointmentRequest) {
    return httpClient.post(`/api/appointments`, appointmentRequest);
  }

  static updateAppointment(
    appointmentId: number,
    updateRequest: UpdateAppointmentRequest
  ) {
    return httpClient.put(`/api/appointments/${appointmentId}`, updateRequest);
  }

  static deleteAppointment(
    appointmentId: number,
    scheduleId: number,
    removeRecurrence: boolean
  ) {
    return httpClient.delete(
      `/api/appointments/${appointmentId}/schedules/${scheduleId}?removeRecurrence=${removeRecurrence}`
    );
  }
}

import { httpClient } from "@/httpClient";
import { Appointment } from "./interfaces";

export class AppointmentService {
  static getAppointments(courtId: number, date: string) {
    return httpClient.get<Appointment[]>(
      `/courts/${courtId}/appointments?date=${date}`
    );
  }

  static addAppointment(courtId: number, appointment: Appointment) {
    return httpClient.post(`/courts/${courtId}/appointments`, appointment);
  }

  static updateAppointment(courtId: number, appointment: Appointment) {
    return httpClient.put(`/courts/${courtId}/appointments/${appointment.id}`, {
      customerName: appointment.customerName,
      customerPhoneNumber: appointment.customerPhoneNumber,
      recurrenceType: appointment.recurrenceType,
    });
  }

  static deleteAppointment(courtId: number, appointmentId: number) {
    return httpClient.delete(
      `/courts/${courtId}/appointments/${appointmentId}`
    );
  }
}

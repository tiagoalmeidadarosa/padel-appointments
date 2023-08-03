import { httpClient } from "@/httpClient";
import { Appointment, CourtAppointment } from "./interfaces";

export class AppointmentService {
  static getCourtsAppointments(date: string) {
    return httpClient.get<CourtAppointment[]>(
      `/courts/appointments?date=${date}`
    );
  }

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
      price: appointment?.price,
      recurrenceType: appointment.recurrenceType,
    });
  }

  static deleteAppointment(courtId: number, appointmentId: number) {
    return httpClient.delete(
      `/courts/${courtId}/appointments/${appointmentId}`
    );
  }
}

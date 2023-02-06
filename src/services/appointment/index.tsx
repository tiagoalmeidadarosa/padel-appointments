import { appointmentsApiUrl } from "@/config";
import { httpClient } from "@/httpClient";
import { Appointment } from "./interfaces";

export class AppointmentService {
  static getAppointments(courtId: number, date: string) {
    return httpClient.get<Appointment[]>(
      `${appointmentsApiUrl}/courts/${courtId}/appointments?date=${date}`
    );
  }

  static addAppointment(courtId: number, appointment: Appointment) {
    return httpClient.post(
      `${appointmentsApiUrl}/courts/${courtId}/appointments`,
      appointment
    );
  }

  static updateAppointment(courtId: number, appointment: Appointment) {
    return httpClient.put(
      `${appointmentsApiUrl}/courts/${courtId}/appointments/${appointment.id}`,
      {
        customerName: appointment.customerName,
        customerPhoneNumber: appointment.customerPhoneNumber,
      }
    );
  }

  static deleteAppointment(courtId: number, appointmentId: number) {
    return httpClient.delete(
      `${appointmentsApiUrl}/courts/${courtId}/appointments/${appointmentId}`
    );
  }
}

import { httpClient } from "@/httpClient";
import { Appointment, Schedule } from "@/shared/interfaces";

export class AppointmentService {
  static addAppointment(
    date: string,
    appointment: Appointment | null,
    schedules: Schedule[],
    agendaId: number
  ) {
    return httpClient.post(`/api/appointments`, {
      date: date,
      customerName: appointment?.customerName,
      customerPhoneNumber: appointment?.customerPhoneNumber,
      price: appointment?.price,
      hasRecurrence: appointment?.hasRecurrence,
      schedules: schedules,
      agendaId: agendaId,
    });
  }

  static updateAppointment(appointment: Appointment) {
    return httpClient.put(`/api/appointments/${appointment.id}`, {
      customerName: appointment.customerName,
      customerPhoneNumber: appointment.customerPhoneNumber,
      price: appointment.price,
    });
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

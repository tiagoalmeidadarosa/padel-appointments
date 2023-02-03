import { appointmentsApiUrl } from "@/config";

export class AppointmentService {
  static async getAppointments(courtId: number, date: Date) {
    const res = await fetch(
      `${appointmentsApiUrl}/courts/${courtId}/appointments?date=${date.toISOString().split('T')[0]}`
    );
    const data = await res.json();
    return data;
  }
}

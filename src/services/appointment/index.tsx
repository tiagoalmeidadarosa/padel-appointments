import { appointmentsApiUrl } from "@/config";
import { getUTCString } from "@/utils/date";

export class AppointmentService {
  static async getAppointments(courtId: number, date: Date) {
    const res = await fetch(
      `${appointmentsApiUrl}/courts/${courtId}/appointments?date=${getUTCString(
        date
      )}`
    );
    const data = await res.json();
    return data;
  }
}

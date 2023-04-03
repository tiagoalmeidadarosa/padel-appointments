export interface CourtAppointment {
  id: number;
  appointments: Appointment[];
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  customerName: string;
  customerPhoneNumber: string;
  recurrenceType?: RecurrenceType,
}

export enum RecurrenceType {
  NextWeek = 'NextWeek',
  NextMonth = 'NextMonth',
}

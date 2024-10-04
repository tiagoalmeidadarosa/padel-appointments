import { Check } from "@/shared/interfaces";

export interface Appointment {
  id: number;
  date: string;
  customerName: string;
  customerPhoneNumber: string;
  price: number;
  hasRecurrence: boolean;
  check: Check;
  agendaId: number;
}

export interface Schedule {
  id: number;
  date: string;
  time: string;
  appointment: Appointment;
}

export interface AppointmentRequest {
  date: string;
  customerName: string;
  customerPhoneNumber: string;
  price: number;
  schedules: Schedule[];
}

export interface UpdateAppointmentRequest {
  customerName: string;
  customerPhoneNumber: string;
  price: number;
}

export interface Check {
  id: number;
  date: string;
  priceDividedBy: number;
  pricePaidFor: number;
  itemsConsumed: ItemConsumed[];
}

export interface ItemConsumed {
  id: number;
  quantity: number;
  description: string;
  price: number;
  paid: boolean;
}

export interface CheckRequest {
  priceDividedBy: number;
  pricePaidFor: number;
  itemsConsumed: ItemConsumed[];
}

export interface Agenda {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  interval: number;
}

export interface AgendaRequest {
  name: string;
  startsAt: string;
  endsAt: string;
  interval: number;
}

export interface UpdateAgendaRequest {
  name: string;
}

export interface Schedule {
  id: number;
  date: string;
  time: string;
  appointment: Appointment;
}

export interface Product {
  id: number;
  name: string;
}

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

export interface AppointmentRequest {
  date: string;
  customerName: string;
  customerPhoneNumber: string;
  price: number;
  schedules: Schedule[];
  agendaId: number;
}

export interface UpdateAppointmentRequest {
  customerName: string;
  customerPhoneNumber: string;
  price: number;
}

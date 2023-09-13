export interface Appointment {
  id: number;
  date: string;
  customerName: string;
  customerPhoneNumber: string;
  price: number;
  hasRecurrence: boolean;
  itemsConsumed: ItemConsumed[];
}

export interface ItemConsumed {
  id: number;
  quantity: number;
  description: string;
  price: number;
}

export interface Schedule {
  id: number;
  date: string;
  time: string;
  courtId: number;
  appointment: Appointment;
}

export interface AppointmentRequest {
  date: string;
  customerName: string;
  customerPhoneNumber: string;
  price: number;
  schedules: Schedule[];
  itemsConsumed: ItemConsumed[];
}

export interface UpdateAppointmentRequest {
  customerName: string;
  customerPhoneNumber: string;
  price: number;
  itemsConsumed: ItemConsumed[];
}

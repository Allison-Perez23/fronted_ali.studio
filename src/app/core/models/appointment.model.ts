import { User } from './user.model';
import { Service } from './service.model';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface Appointment {
  id?: number;
  service_id: number;
  employee_id?: number;
  client_id?: number;
  appointment_date: string; // ISO string
  status?: AppointmentStatus;
  notes?: string;
  
  // Optional relations
  client?: User;
  employee?: User;
  service?: Service;
}

export interface AppointmentCreate {
  service_id: number;
  employee_id?: number;
  appointment_date: string;
  notes?: string;
}

export interface AppointmentUpdate {
  employee_id?: number;
  appointment_date?: string;
  status?: AppointmentStatus;
  notes?: string;
}

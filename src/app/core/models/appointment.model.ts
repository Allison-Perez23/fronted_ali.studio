import { Service } from './service.model';
import { User } from './user.model';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Appointment {
  identifier: number;
  client_id: number;
  service_id: number;
  employee_id?: number;
  date_time: string;
  status: string;
  client?: User;
  service?: Service;
  employee?: User;
}

export interface AppointmentCreate {
  client_id: number;
  service_id: number;
  employee_id?: number;
  date_time: string;
}

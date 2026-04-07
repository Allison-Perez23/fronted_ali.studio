import { User } from './user.model';
import { Service } from './service.model';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Appointment {
  identifier: number;
  date_time: string;
  status: AppointmentStatus;
  notes?: string;
  client_id: number;
  employee_id: number;
  service_id: number;
  client?: User;
  employee?: User;
  service?: Service;
}

export interface AppointmentCreate {
  date_time: string;
  service_id: number;
  employee_id?: number;
  notes?: string;
}

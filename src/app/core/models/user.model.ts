export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT'
}

export interface User {
  identifier: number;
  first_name: string;
  last_name: string;
  first_surname: string;
  last_surname: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  phone?: string;
  birthday?: string;
  address?: string;
  password?: string; // Only for creation/updates
}

export interface Token {
  access_token: string;
  token_type: string;
}

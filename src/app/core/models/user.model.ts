export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CLIENT = 'client'
}

export interface User {
  identifier: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
}

export interface Token {
  access_token: string;
  token_type: string;
}

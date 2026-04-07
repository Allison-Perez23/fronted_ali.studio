import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { ServicesComponent } from './pages/services/services';
import { AppointmentsComponent } from './pages/appointments/appointments';

export const routes: Routes = [
  { path: '', redirectTo: 'appointments', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: '**', redirectTo: 'appointments' }
];

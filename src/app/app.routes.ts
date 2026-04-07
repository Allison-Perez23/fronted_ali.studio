import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing';
import { LoginComponent } from './pages/login/login';
import { ServicesComponent } from './pages/services/services';
import { AppointmentsComponent } from './pages/appointments/appointments';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: '**', redirectTo: '' }
];

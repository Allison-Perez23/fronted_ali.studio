import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Scissors, Calendar, Settings, LogOut, User, Users, X } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  authService = inject(AuthService);
  
  readonly LayoutDashboard = LayoutDashboard;
  readonly Scissors = Scissors;
  readonly Calendar = Calendar;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly User = User;
  readonly Users = Users;
  readonly X = X;

  menuItems = [
    { label: 'Dashboard', route: '/', icon: this.LayoutDashboard },
    { label: 'Servicios', route: '/services', icon: this.Scissors },
    { label: 'Citas', route: '/appointments', icon: this.Calendar },
    // Admin only placeholder
    { label: 'Usuarios', route: '/users', icon: this.Users, adminOnly: true },
  ];

  bottomItems = [
    { label: 'Mi Perfil', route: '/profile', icon: this.User },
    { label: 'Configuración', route: '/settings', icon: this.Settings },
  ];
}

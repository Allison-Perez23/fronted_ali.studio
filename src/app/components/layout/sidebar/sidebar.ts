import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Scissors, Calendar, Settings, LogOut, User } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  
  readonly LayoutDashboard = LayoutDashboard;
  readonly Scissors = Scissors;
  readonly Calendar = Calendar;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly User = User;

  menuItems = [
    { label: 'Dashboard', route: '/', icon: this.LayoutDashboard },
    { label: 'Servicios', route: '/services', icon: this.Scissors },
    { label: 'Citas', route: '/appointments', icon: this.Calendar },
  ];

  bottomItems = [
    { label: 'Perfil', route: '/login', icon: this.User },
    { label: 'Configuración', route: '/settings', icon: this.Settings },
  ];
}

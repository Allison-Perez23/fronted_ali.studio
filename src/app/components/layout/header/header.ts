import { Component, Output, EventEmitter, inject } from '@angular/core';
import { LucideAngularModule, Search, Bell, Menu } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  protected authService = inject(AuthService);

  readonly Search = Search;
  readonly Bell = Bell;
  readonly Menu = Menu;

  onMenuClick() {
    this.toggleSidebar.emit();
  }
}

import { Component, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, Search, Bell, Menu } from 'lucide-angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly Search = Search;
  readonly Bell = Bell;
  readonly Menu = Menu;

  onMenuClick() {
    this.toggleSidebar.emit();
  }
}

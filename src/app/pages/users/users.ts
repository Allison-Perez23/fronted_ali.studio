import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User, UserRole } from '../../core/models/user.model';
import { LucideAngularModule, Search, Edit2, Trash2, Filter } from 'lucide-angular';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  
  // Expose enum to template
  readonly UserRole = UserRole;
  
  // Signals
  users = signal<User[]>([]);
  currentView = signal<UserRole>(UserRole.CLIENT);
  loading = signal(true);
  searchTerm = signal('');

  // Computed signal for filtered list
  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.users().filter(user => 
      `${user.first_name} ${user.last_name || ''} ${user.first_surname} ${user.email}`.toLowerCase().includes(term)
    );
  });

  readonly Search = Search;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Filter = Filter;

  ngOnInit() {
    this.loadUsersByRole(UserRole.CLIENT);
  }

  loadUsersByRole(role: UserRole | string) {
    const roleToLoad = role as UserRole;
    this.currentView.set(roleToLoad);
    this.loading.set(true);
    
    this.userService.getUsersByRole(roleToLoad).subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  editUser(user: User) {
    console.log('Editing user:', user);
  }

  deleteUser(user: User) {
    if (confirm(`¿Estás segura de eliminar a ${user.first_name}?`)) {
      this.userService.deleteUser(user.identifier).subscribe(() => {
        this.loadUsersByRole(this.currentView());
      });
    }
  }
}

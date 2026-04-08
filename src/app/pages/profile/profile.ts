import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User, UserRole } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';
import { 
  LucideAngularModule, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  MapPin, 
  Lock, 
  Edit3, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private location = inject(Location);
  
  // Icons exposure
  readonly UserIcon = UserIcon;
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly CalendarIcon = CalendarIcon;
  readonly MapPin = MapPin;
  readonly Lock = Lock;
  readonly Edit3 = Edit3;
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;
  readonly ArrowLeft = ArrowLeft;
  readonly ShieldCheck = ShieldCheck;
  readonly CheckCircle2 = CheckCircle2;
  readonly AlertCircle = AlertCircle;

  // Signals for state
  user = signal<User | null>(null);
  loading = signal(true);
  saving = signal(false);
  mode = signal<'view' | 'edit' | 'password'>('view');
  toast = signal<{ message: string, type: 'success' | 'error' | null }>({ message: '', type: null });

  // Form Data (can stay as regular object for ngModel binding, or signals)
  editData: Partial<User> = {};
  passwordData = {
    old_password: '',
    new_password: '',
    confirm_password: ''
  };

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
        this.showToast('Error al cargar la información del perfil', 'error');
      }
    });
  }

  enterEditMode() {
    const currentUser = this.user();
    if (!currentUser) return;
    this.editData = { ...currentUser };
    this.mode.set('edit');
  }

  enterPasswordMode() {
    this.passwordData = { old_password: '', new_password: '', confirm_password: '' };
    this.mode.set('password');
  }

  cancelEdit() {
    this.mode.set('view');
  }

  saveProfile() {
    this.saving.set(true);
    const { first_name, last_name, first_surname, last_surname, phone, birthday, address } = this.editData;
    const updatePayload = { first_name, last_name, first_surname, last_surname, phone, birthday, address };

    this.userService.updateCurrentUser(updatePayload).subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.saving.set(false);
        this.mode.set('view');
        this.showToast('¡Perfil actualizado con éxito!', 'success');
      },
      error: (err) => {
        this.saving.set(false);
        this.showToast('Error al actualizar el perfil', 'error');
      }
    });
  }

  changePassword() {
    if (this.passwordData.new_password !== this.passwordData.confirm_password) {
      this.showToast('Las contraseñas no coinciden', 'error');
      return;
    }
    
    this.saving.set(true);
    const { old_password, new_password } = this.passwordData;
    
    this.userService.changePassword({ old_password, new_password }).subscribe({
      next: () => {
        this.saving.set(false);
        this.mode.set('view');
        this.showToast('Contraseña actualizada exitosamente', 'success');
      },
      error: (err) => {
        this.saving.set(false);
        const detail = err.error?.detail || 'Error al cambiar la contraseña';
        this.showToast(detail, 'error');
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  goBack() {
    this.location.back();
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
    setTimeout(() => {
      this.toast.set({ message: '', type: null });
    }, 4000);
  }
}

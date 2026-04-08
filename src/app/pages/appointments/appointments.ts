import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles, CheckCircle2, User as UserIcon, Plus, MapPin, Search, X, Trash2, Edit2 } from 'lucide-angular';
import { AppointmentService } from '../../core/services/appointment.service';
import { ServiceService } from '../../core/services/service.service';
import { UserService } from '../../core/services/user.service';
import { Appointment, AppointmentStatus } from '../../core/models/appointment.model';
import { Service } from '../../core/models/service.model';
import { User, UserRole } from '../../core/models/user.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss'
})
export class AppointmentsComponent implements OnInit {
  private appointmentService = inject(AppointmentService);
  private serviceService = inject(ServiceService);
  private userService = inject(UserService);
  protected authService = inject(AuthService);

  // Icons
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly CalendarIcon = CalendarIcon;
  readonly Clock = Clock;
  readonly Sparkles = Sparkles;
  readonly CheckCircle2 = CheckCircle2;
  readonly UserIcon = UserIcon;
  readonly Plus = Plus;
  readonly MapPin = MapPin;
  readonly Search = Search;
  readonly X = X;
  readonly Trash2 = Trash2;
  readonly Edit2 = Edit2;

  // Calendar State
  currentDate = signal(new Date());
  selectedDate = signal(new Date());
  appointments = signal<Appointment[]>([]);
  loading = signal(true);

  // Detail/Edit State
  selectedAppointment = signal<Appointment | null>(null);
  isDetailModalOpen = signal(false);

  // Booking Flow State
  isBookingModalOpen = signal(false);
  isEditMode = signal(false);
  bookingStep = signal(1); // 1: Service, 2: Employee, 3: Date/Time, 4: Summary
  services = signal<Service[]>([]);
  employees = signal<User[]>([]);
  
  // Selected values for new appointment
  selectedService = signal<Service | null>(null);
  selectedEmployee = signal<User | null>(null);
  selectedTimeSlot = signal<string | null>(null);
  notes = signal('');

  // Computed Properties for Calendar
  monthName = computed(() => {
    return this.currentDate().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  calendarDays = computed(() => {
    const date = this.currentDate();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const days = [];
    const startOffset = firstDay.getDay(); // 0 = Sunday
    
    // Previous month padding
    const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        month: 'prev',
        date: new Date(date.getFullYear(), date.getMonth() - 1, prevMonthLastDay - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const d = new Date(date.getFullYear(), date.getMonth(), i);
      days.push({
        day: i,
        month: 'current',
        date: d,
        isToday: this.isSameDay(d, new Date()),
        isSelected: this.isSameDay(d, this.selectedDate()),
        hasAppointments: this.hasAppointmentsOnDate(d)
      });
    }
    
    // Next month padding
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: 'next',
        date: new Date(date.getFullYear(), date.getMonth() + 1, i)
      });
    }
    
    return days;
  });

  // Schedule for the selected day
  daySchedule = computed(() => {
    const selected = this.selectedDate();
    return this.appointments().filter(a => this.isSameDate(new Date(a.appointment_date), selected))
      .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
  });

  // Time slots for booking
  timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData() {
    this.loading.set(true);
    // Load services, employees and all appointments
    this.serviceService.getServices().subscribe(data => this.services.set(data));
    this.userService.getUsersByRole(UserRole.EMPLOYEE).subscribe((data: User[]) => this.employees.set(data));
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // Navigation
  previousMonth() {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() - 1);
    this.currentDate.set(d);
  }

  nextMonth() {
    const d = new Date(this.currentDate());
    d.setMonth(d.getMonth() + 1);
    this.currentDate.set(d);
  }

  selectDate(date: Date) {
    this.selectedDate.set(date);
    this.openBookingAtDate(date);
  }

  openBookingAtDate(date: Date) {
    this.selectedDate.set(date);
    this.isBookingModalOpen.set(true);
    this.bookingStep.set(1);
  }

  openEditAppointment(app: Appointment) {
    this.selectedAppointment.set(app);
    this.isEditMode.set(true);
    this.isDetailModalOpen.set(false);
    this.isBookingModalOpen.set(true);
    
    // Pre-fill state
    this.selectedDate.set(new Date(app.appointment_date));
    this.selectedService.set(app.service || null);
    this.selectedEmployee.set(app.employee || null);
    this.selectedTimeSlot.set(this.formatTimeToSlot(app.appointment_date));
    this.notes.set(app.notes || '');
    this.bookingStep.set(1);
  }

  closeModal() {
    this.isBookingModalOpen.set(false);
    this.isEditMode.set(false);
    this.resetBooking();
  }

  resetBooking() {
    this.selectedService.set(null);
    this.selectedEmployee.set(null);
    this.selectedTimeSlot.set(null);
    this.bookingStep.set(1);
    this.notes.set('');
  }

  // Booking steps
  selectService(service: Service) {
    this.selectedService.set(service);
    this.bookingStep.set(2);
  }

  selectEmployee(employee: User) {
    this.selectedEmployee.set(employee);
    this.bookingStep.set(3);
  }

  confirmBooking() {
    const date = this.selectedDate();
    const time = this.selectedTimeSlot();
    const service = this.selectedService();
    const employee = this.selectedEmployee();

    if (!date || !time || !service || !employee) return;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const appointmentDate = `${year}-${month}-${day}T${time}:00`;

    this.loading.set(true);

    if (this.isEditMode() && this.selectedAppointment()?.id) {
      this.appointmentService.updateAppointment(this.selectedAppointment()!.id!, {
        service_id: service.identifier,
        employee_id: employee.identifier,
        appointment_date: appointmentDate,
        notes: this.notes()
      } as any).subscribe({
        next: () => {
          this.loadInitialData();
          this.closeModal();
        },
        error: (err) => {
          this.loading.set(false);
          console.error(err);
        }
      });
    } else {
      this.appointmentService.createAppointment({
        service_id: service.identifier,
        employee_id: employee.identifier,
        appointment_date: appointmentDate,
        notes: this.notes()
      }).subscribe({
        next: () => {
          this.loadInitialData();
          this.closeModal();
        },
        error: (err) => {
          this.loading.set(false);
          console.error(err);
        }
      });
    }
  }

  private formatTimeToSlot(dateStr: string): string {
    const date = new Date(dateStr);
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    return `${h}:${m}`;
  }

  openAppointmentDetail(app: Appointment) {
    this.selectedAppointment.set(app);
    this.isDetailModalOpen.set(true);
  }

  closeDetailModal() {
    this.isDetailModalOpen.set(false);
    this.selectedAppointment.set(null);
  }

  cancelAppointment(id?: number) {
    if (!id) return;
    if (confirm('¿Estás segura de que deseas cancelar esta cita?')) {
      this.loading.set(true);
      this.appointmentService.updateAppointment(id, { status: AppointmentStatus.CANCELLED }).subscribe({
        next: () => {
          this.loadInitialData();
          this.closeDetailModal();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  deleteAppointment(id?: number) {
    if (!id) return;
    if (confirm('¿Estás segura de eliminar permanentemente esta cita?')) {
      this.loading.set(true);
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.loadInitialData();
          this.closeDetailModal();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  // Helper Methods
  isSameDay(d1: Date, d2: Date): boolean {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  isSameDate(d1: Date, d2: Date): boolean {
    return this.isSameDay(d1, d2);
  }

  hasAppointmentsOnDate(date: Date): boolean {
     return this.appointments().some(a => this.isSameDate(new Date(a.appointment_date), date));
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  getTranslateY(dateStr: string): number {
    const date = new Date(dateStr);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = (hour - 8) * 60 + minutes;
    return totalMinutes * 1.5; // 1.5px per minute
  }
}

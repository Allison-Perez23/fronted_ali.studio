import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Plus, Pencil, Trash2, X, Sparkles, Clock, DollarSign } from 'lucide-angular';
import { ServiceService } from '../../core/services/service.service';
import { Service } from '../../core/models/service.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent implements OnInit {
  private serviceService = inject(ServiceService);

  services = signal<Service[]>([]);
  loading = signal(true);
  error = signal('');
  
  // Modal State
  isModalOpen = signal(false);
  isEditMode = signal(false);
  selectedService = signal<Service | null>(null);

  // Form State
  serviceForm = {
    name: signal(''),
    description: signal(''),
    price: signal(0),
    duration_minutes: signal(30)
  };

  // Icons
  readonly Plus = Plus;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Sparkles = Sparkles;
  readonly Clock = Clock;
  readonly DollarSign = DollarSign;

  ngOnInit() {
    this.fetchServices();
  }

  fetchServices() {
    this.loading.set(true);
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los servicios.');
        this.loading.set(false);
      }
    });
  }

  openModal(service?: Service) {
    if (service) {
      this.isEditMode.set(true);
      this.selectedService.set(service);
      this.serviceForm.name.set(service.name);
      this.serviceForm.description.set(service.description);
      this.serviceForm.price.set(service.price);
      this.serviceForm.duration_minutes.set(service.duration_minutes);
    } else {
      this.isEditMode.set(false);
      this.selectedService.set(null);
      this.resetForm();
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  resetForm() {
    this.serviceForm.name.set('');
    this.serviceForm.description.set('');
    this.serviceForm.price.set(0);
    this.serviceForm.duration_minutes.set(30);
  }

  saveService() {
    const payload = {
      name: this.serviceForm.name(),
      description: this.serviceForm.description(),
      price: this.serviceForm.price(),
      duration_minutes: this.serviceForm.duration_minutes()
    };

    this.loading.set(true);
    if (this.isEditMode() && this.selectedService()) {
      this.serviceService.updateService(this.selectedService()!.identifier, payload).subscribe({
        next: () => {
          this.fetchServices();
          this.closeModal();
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.serviceService.createService(payload).subscribe({
        next: () => {
          this.fetchServices();
          this.closeModal();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  deleteService(service: Service) {
    if (confirm(`¿Estás segura de eliminar el servicio "${service.name}"?`)) {
      this.loading.set(true);
      this.serviceService.deleteService(service.identifier).subscribe({
        next: () => this.fetchServices(),
        error: () => this.loading.set(false)
      });
    }
  }

  getGradient(index: number): string {
    return index % 2 === 0 ? 'pink-gradient' : 'gold-gradient';
  }
}

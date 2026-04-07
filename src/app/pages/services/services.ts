import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ServiceService } from '../../core/services/service.service';
import { Service } from '../../core/models/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class ServicesComponent implements OnInit {
  services: Service[] = [];
  loading = true;
  error = '';

  constructor(
    private serviceService: ServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fetchServices();
  }

  fetchServices() {
    this.loading = true;
    this.error = '';
    
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data;
        this.loading = false;
        this.cdr.detectChanges(); // Forcing detection in case of zone issues
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los servicios.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  getGradient(index: number): string {
    return index % 2 === 0 ? 'pink-gradient' : 'gold-gradient';
  }
}

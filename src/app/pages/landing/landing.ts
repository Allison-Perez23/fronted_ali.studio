import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ChevronRight, CheckCircle, Sparkles, Clock, Home, Scissors, Calendar, User } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { ServiceService } from '../../core/services/service.service';
import { Service } from '../../core/models/service.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent implements OnInit {
  authService = inject(AuthService);
  serviceService = inject(ServiceService);
  
  readonly ChevronRight = ChevronRight;
  readonly CheckCircle = CheckCircle;
  readonly Sparkles = Sparkles;
  readonly Clock = Clock;
  readonly Home = Home;
  readonly Scissors = Scissors;
  readonly Calendar = Calendar;
  readonly User = User;

  stats = [
    { label: 'Certificada', icon: this.CheckCircle },
    { label: 'Premium', icon: this.Sparkles },
    { label: 'Citas 24/7', icon: this.Clock }
  ]

  // Relative paths for the assets folder
  serviceImages = [
    '/assets/manicure.png',
    '/assets/pedicure.png',
    '/assets/nailart.png',
    '/assets/hero.png'
  ];

  services: Service[] = [];

  ngOnInit() {
    this.serviceService.getServices().subscribe({
      next: (data) => {
        this.services = data.slice(0, 4);
      },
      error: (err) => console.error('Error loading landing services', err)
    });
  }

  getImage(index: number): string {
    return this.serviceImages[index % this.serviceImages.length];
  }
}

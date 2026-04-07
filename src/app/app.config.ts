import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { LucideAngularModule, Search, Bell, Menu, LayoutDashboard, Scissors, Calendar, Settings, LogOut, User, Sparkles, Heart, Star, Clock, MoreVertical } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        Search, 
        Bell, 
        Menu, 
        LayoutDashboard, 
        Scissors, 
        Calendar, 
        Settings, 
        LogOut, 
        User,
        Sparkles,
        Heart,
        Star,
        Clock,
        MoreVertical
      })
    )
  ]
};

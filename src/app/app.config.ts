import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { 
  LucideAngularModule, 
  Search, 
  Bell, 
  Menu, 
  ArrowLeft,
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
  MoreVertical,
  ChevronRight,
  CheckCircle,
  Home,
  Users,
  Edit2,
  Edit3,
  Trash2,
  Filter,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-angular';

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
        MoreVertical,
        ChevronRight,
        ArrowLeft,
        CheckCircle,
        CheckCircle2,
        Home,
        Users,
        Edit2,
        Edit3,
        Trash2,
        Filter,
        Mail,
        Phone,
        MapPin,
        Lock,
        ShieldCheck,
        AlertCircle,
        X
      })
    )
  ]
};

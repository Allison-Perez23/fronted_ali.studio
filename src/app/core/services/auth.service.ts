import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Token, User } from '../models/user.model';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/login/access-token`;
  private readonly profileUrl = `${environment.apiUrl}/users/@me`; // Common pattern, let's check
  private readonly tokenKey = 'ali_studio_token';
  
  currentUser = signal<User | null>(null);
  loading = signal(true);

  constructor(private http: HttpClient, private router: Router) {
    this.checkSession();
  }

  login(email: string, password: string) {
    const body = new HttpParams()
      .set('username', email)
      .set('password', password);

    return this.http.post<Token>(this.apiUrl, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap(token => {
        localStorage.setItem(this.tokenKey, token.access_token);
        this.checkSession();
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private checkSession() {
    const token = this.getToken();
    if (!token) {
      this.loading.set(false);
      return;
    }

    // Attempt to fetch user profile if there's a token
    // For now, if we don't have a @me endpoint, we'll just mock the fact we are in
    // In a real app, we'd hit http://localhost:8000/api/v1/users/me
    
    this.loading.set(false);
    // this.currentUser.set(...)
  }
}

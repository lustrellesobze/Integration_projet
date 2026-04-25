import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Personnel } from '../models/personnel';
import api from './api';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // On récupère directement l’URL de base depuis la config centralisée Axios
  private apiUrl = api.defaults.baseURL;

  constructor(private http: HttpClient) {}

  // ========================
  // LOGIN
  // ========================
  login(login_pers: string, pwd_pers: string): Observable<any> {
    const body = {
      login_pers,
      pwd_pers
    };

    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('user', JSON.stringify(res.personnel));
      })
    );
  }

  // ========================
  // LOGOUT
  // ========================
  logout(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })
    );
  }

  // ========================
  // Vérifier si connecté
  // ========================
  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  // ========================
  // Récupérer l'utilisateur connecté
  // ========================
  getUser(): Personnel | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }
}
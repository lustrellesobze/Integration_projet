import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Filiere } from '../models/filiere';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import api from './api';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {

  // URL centralisée depuis api.ts
  private apiUrl = api.defaults.baseURL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // GET avec pagination
  get(page: number = 1, perPage: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(`${this.apiUrl}/filieres`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  save(filiere: Filiere): Observable<Filiere> {
    return this.http.post<Filiere>(`${this.apiUrl}/filieres`, filiere, this.getAuthHeaders())
      .pipe(map((response: any) => response));
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/filieres/${id}`, this.getAuthHeaders())
      .pipe(map((response: any) => response));
  }

  update(filiere: Filiere): Observable<Filiere> {
    return this.http.put<Filiere>(
      `${this.apiUrl}/filieres/${filiere.code_filiere}`,
      filiere,
      this.getAuthHeaders()
    ).pipe(map((response: any) => response));
  }

  // Recherche avec token et pagination
  search(query: string, page: number = 1, perPage: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(`${this.apiUrl}/filieres/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  /**
   * Télécharge la liste des filières en PDF
   */
  exportPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/filieres/export/pdf`, {
      headers: this.getAuthHeaders().headers,
      responseType: 'blob'
    });
  }

  /**
   * Télécharge la liste des filières en Excel
   */
  exportExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/filieres/export/excel`, {
      headers: this.getAuthHeaders().headers,
      responseType: 'blob'
    });
  }
}
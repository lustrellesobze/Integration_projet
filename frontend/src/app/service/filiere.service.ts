import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Filiere } from '../models/filiere';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FiliereService {

  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token'); // récupère le token stocké
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // GET avec pagination
  get(page: number = 1, perPage: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(`${this.apiUrl}/filieres`, { ...this.getAuthHeaders(), params });
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
    return this.http.put<Filiere>(`${this.apiUrl}/filieres/${filiere.code_filiere}`, filiere, this.getAuthHeaders())
      .pipe(map((response: any) => response));
  }

  // Recherche avec token et pagination
  search(query: string, page: number = 1, perPage: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(`${this.apiUrl}/filieres/search`, { ...this.getAuthHeaders(), params });
  }

  // --- NOUVELLES MÉTHODES D'EXPORTATION ---

  /**
   * Télécharge la liste des filières en PDF
   */
  exportPdf(): Observable<Blob> {
    const headers = this.getAuthHeaders().headers;
    return this.http.get(`${this.apiUrl}/filieres/export/pdf`, {
      headers: headers,
      responseType: 'blob' // Obligatoire pour récupérer un fichier binaire
    });
  }

  /**
   * Télécharge la liste des filières en Excel
   */
  exportExcel(): Observable<Blob> {
    const headers = this.getAuthHeaders().headers;
    return this.http.get(`${this.apiUrl}/filieres/export/excel`, {
      headers: headers,
      responseType: 'blob' // Obligatoire pour récupérer un fichier binaire
    });
  }
}
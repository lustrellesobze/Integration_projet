import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Ec } from '../models/ec';
import { AuthService } from './auth.service';
import api from './api';

@Injectable({
  providedIn: 'root'
})
export class EcService {

  // URL centralisée depuis api.ts
  private apiUrl = api.defaults.baseURL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Récupère les headers avec le token d'authentification
   */
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  /**
   * Récupérer la liste des UE pour le select du formulaire
   * Route Laravel : api/Ue
   */
  getUes(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Ue`, this.getAuthHeaders())
      .pipe(map((response: any) => response.data));
  }

  /**
   * GET avec pagination
   * URL : api/ec
   */
  get(page: number = 1, perPage: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(`${this.apiUrl}/ec`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  /**
   * Sauvegarder un nouvel EC
   */
  save(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ec`, formData, this.getAuthHeaders())
      .pipe(map((response: any) => response));
  }

  /**
   * Mettre à jour un EC (Hack _method PUT pour les fichiers)
   */
  update(id: number | string, formData: FormData): Observable<any> {
    formData.append('_method', 'PUT');

    return this.http.post<any>(`${this.apiUrl}/ec/${id}`, formData, this.getAuthHeaders())
      .pipe(map((response: any) => response));
  }

  /**
   * Supprimer un EC
   */
  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/ec/${id}`, this.getAuthHeaders())
      .pipe(map((response: any) => response));
  }

  /**
   * Récupérer un EC par son ID
   */
  getById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ec/${id}`, this.getAuthHeaders())
      .pipe(map((response: any) => response));
  }

  /**
   * Recherche avec token et pagination
   */
  search(query: string, page: number = 1, perPage: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any>(`${this.apiUrl}/ec/search`, {
      ...this.getAuthHeaders(),
      params
    });
  }

  /**
   * Télécharger le PDF de l'image de l'EC
   * @param id Le code_ec ou l'id de l'EC
   */
  downloadImagePdf(id: string | number): void {
    const url = `${this.apiUrl}/ec/download-image/${id}`;

    this.http.get(url, {
      ...this.getAuthHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (blob: Blob) => {
        if (blob.size === 0) {
          alert('Le fichier semble vide.');
          return;
        }

        const fileName = `Export_Image_EC_${id}.pdf`;
        const objectUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        window.URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF', err);

        if (err.status === 404) {
          alert('Erreur : Cet EC n\'a pas d\'image associée ou n\'existe pas.');
        } else {
          alert('Une erreur est survenue lors de la génération du PDF.');
        }
      }
    });
  }
}
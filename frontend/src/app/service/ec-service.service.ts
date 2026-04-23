import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Ec } from '../models/ec';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EcService {

  // URL de ton API Laravel
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Récupère les headers avec le token d'authentification
   */
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  /**
   * NOUVEAU : Récupérer la liste des UE pour le select du formulaire
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

    return this.http.get<any>(`${this.apiUrl}/ec`, { ...this.getAuthHeaders(), params });
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

    return this.http.get<any>(`${this.apiUrl}/ec/search`, { ...this.getAuthHeaders(), params });
  }

 /**
 * Télécharger le PDF de l'image de l'EC
 * @param id Le code_ec ou l'id de l'EC
 */
downloadImagePdf(id: string | number): void {
  // ✅ Correction de l'URL : /ec/ au lieu de /ecs/ pour correspondre à ton backend
  const url = `${this.apiUrl}/ec/download-image/${id}`;

  this.http.get(url, {
    ...this.getAuthHeaders(),
    responseType: 'blob' // Indispensable pour recevoir le flux binaire du PDF
  }).subscribe({
    next: (blob: Blob) => {
      // Vérification si le blob est valide
      if (blob.size === 0) {
        alert('Le fichier semble vide.');
        return;
      }

      // Création du nom de fichier propre
      const fileName = `Export_Image_EC_${id}.pdf`;
      
      // Création d'un lien temporaire dans le navigateur
      const objectUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = fileName;
      
      // Déclenchement du téléchargement
      document.body.appendChild(a); // Ajout temporaire au DOM pour Firefox
      a.click();
      
      // Nettoyage immédiat
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    },
    error: (err) => {
      console.error('Erreur lors du téléchargement du PDF', err);
      // On peut vérifier le statut de l'erreur
      if (err.status === 404) {
        alert('Erreur : Cet EC n\'a pas d\'image associée ou n\'existe pas.');
      } else {
        alert('Une erreur est survenue lors de la génération du PDF.');
      }
    }
  });
}
 
}
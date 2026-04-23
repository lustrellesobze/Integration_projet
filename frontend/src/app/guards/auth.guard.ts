import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // disponible globalement
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const user = localStorage.getItem('user');

    if (user) {
      return true; // l'utilisateur est connecté, accès autorisé
    } else {
      // utilisateur non connecté, redirige vers la page d'accueil ou connexion
      // alert('Vous devez être connecté pour accéder à cette page !');
      this.router.navigate(['/']); 
      return false;
    }
  }
}

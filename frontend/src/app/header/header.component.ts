import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service'; // <-- AJOUT

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, LoginModalComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userLoggedIn: boolean = false;
  username: string = '';

  constructor(private router: Router, private authService: AuthService) {} // Injection AuthService

  ngOnInit() {
    this.checkUser();
  }

  // Vérifie si l'utilisateur est connecté et récupère son nom
  checkUser() {
    const user = this.authService.getUser(); // récupère l'objet user depuis le service
    this.userLoggedIn = !!user;
    this.username = user?.nom_pers ?? '';
  }

  // Déconnexion
  logout() {
    const confirmLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (!confirmLogout) return;

    this.authService.logout().subscribe(() => {
      this.checkUser(); // Met à jour l'état de la navbar
      this.router.navigate(['/']); // Redirige vers la page de connexion
    });
  }

  // Recevoir les événements du composant enfant (login-modal)
  recuperer(event: string) {
    console.log('Données reçues du composant enfant Header:', event);
    this.checkUser(); // Met à jour l'état après login
  }
}

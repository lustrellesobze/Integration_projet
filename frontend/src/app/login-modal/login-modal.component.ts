import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth.service';  // <--- AJOUT

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent {

  @Input() login?: string;
  @Output() sortie = new EventEmitter<string>();

  email: string = '';
  password: string = '';
  erreur: string = '';

  constructor(private authService: AuthService) {}   // <--- AJOUT

  fermer() {
    this.sortie.emit("Fermeture du modal");
  }

  loginUser() {

    this.erreur = ""; // reset message

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log("Connexion réussie:", res);

        this.sortie.emit("Connexion réussie !");
        this.fermer();
      },

      error: (err) => {
        console.error(err);

        if (err.status === 401) {
          this.erreur = "Identifiants incorrects";
        } else {
          this.erreur = "Erreur serveur. Réessaye plus tard.";
        }
      }
    });
  }
}

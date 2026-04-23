import { Component } from '@angular/core';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-content',
  imports: [LoginModalComponent, FormsModule, RouterLink],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
  number = 10
  modifiable:boolean = false
  action:string = "Desactiver"
  type = "text"


  switch_action(){
    this.modifiable=!this.modifiable
    this.action = this.action =="Activer" ? "Desactiver":"Activer"
    this.type = this.type =="text" ? "password":"text"
  }

  factoriel(n:number):number {
    if(n==0)
      return 1
    return n*this.factoriel(n-1)
  }
}

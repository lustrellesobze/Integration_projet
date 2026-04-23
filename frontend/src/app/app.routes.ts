import { Routes } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { FiliereComponent } from './filiere/filiere.component';
import { NiveauComponent } from './niveau/niveau.component';
import { EcComponent } from './ec/ec.component';
import { UeComponent } from './ue/ue.component';
import { SalleComponent } from './salle/salle.component';
import { AuthGuard } from './guards/auth.guard'; // <-- importer le guard

export const routes: Routes = [
    { path: "", component: ContentComponent },
    { path: "inscription", component: InscriptionComponent,canActivate: [AuthGuard] },
    // Pages protégées par AuthGuard
    { path: "filiere", component: FiliereComponent, canActivate: [AuthGuard] },
    { path: "niveau", component: NiveauComponent, canActivate: [AuthGuard] },
    // { path: "ec/:data", component: EcComponent, canActivate: [AuthGuard] },
    { path: "ec", component: EcComponent, canActivate: [AuthGuard] },
    { path: "ue", component: UeComponent, canActivate: [AuthGuard] },
    { path: "salle", component: SalleComponent, canActivate: [AuthGuard] },
];

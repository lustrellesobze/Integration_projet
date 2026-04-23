import { Ec } from "./ec"
import { Personnel } from "./personnel"
import { Salle } from "./salle"

export class Programmation {
  public code_ec?:string
  public code_pers?:string
  public code_salle?:string

  public date?: Date
  public heure_debu?: Date
  public heure_fin?: Date
  public statut?: "EN COURS" | "EN ATTENTE" | "ACHEVER"
  public created_at?:Date
  public updated_at?:Date

  ec?:Ec
  salle?:Salle
  personnel?:Personnel

}

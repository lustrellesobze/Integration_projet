import { Filiere } from "./filiere"
import { Ue } from "./ue"

export class Niveau {
  public code_niveau?:number
  public label_niveau?:string
  public desc_niveau?:string
  public created_at?:Date
  public updated_at?:Date

 public code_filiere?:string
  filiere?:Filiere;

  ue?:Ue[];
}

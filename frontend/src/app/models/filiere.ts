import { Niveau } from "./niveau"

export class Filiere{
  public code_filiere?:string
  public label_filiere?:string
  public desc_filiere?:string
  public created_at?: Date
  public updated_at?: Date

  niveaux?:Niveau[];
}

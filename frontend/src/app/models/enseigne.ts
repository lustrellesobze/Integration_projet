import { Ec } from "./ec"
import { Personnel } from "./personnel"

export class Enseigne {
  public code_ec?:string
  public code_pers?:string
  public created_at?:Date
  public updated_at?:Date

  ec?:Ec
  personnel?:Personnel
}

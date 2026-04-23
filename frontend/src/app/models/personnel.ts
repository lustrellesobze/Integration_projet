export class Personnel {
 public code_pers?:string
 public nom_pers?: string
 public sexe_pers?: "M" | "F"
 public phone_pers?:string
 public login_pers?:string
 public pwd_pers?: "ENSEIGNANT" | "RESPONSABLE ACADEMIQUE" | "RESPONSABLE DISCIPLINE"
 public created_at?:Date
 public updated_at?:Date
}

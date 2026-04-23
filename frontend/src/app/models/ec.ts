import { Ue } from "./ue";

export class Ec {
  public id?: number;              // Ajouté pour correspondre à l'ID auto-incrémenté
  public code_ec?: string;
  public label_ec?: string;
  public desc_ec?: string;
  public nbh_ec?: number;
  public nbc_ec?: number;
  public image_ec?: string;        // Ajouté pour stocker le chemin de l'image
  public created_at?: Date;
  public updated_at?: Date;

  // Relations
  public code_ue?: string;
  public ue?: Ue;

  constructor(init?: Partial<Ec>) {
    Object.assign(this, init);
  }
}
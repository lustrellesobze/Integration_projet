import { Ec } from "./ec";
import { Niveau } from "./niveau";

export class Ue {
  public code_ue?: string;
  public label_ue?: string;
  public desc_ue?: string;
  public created_at?: Date;
  public updated_at?: Date;

  // Corrigé en string pour correspondre au code_niveau de Laravel
  public code_niveau?: string; 
  
  // Relations
  public niveau?: Niveau;
  
  // Renommé en ecs pour correspondre à la relation Laravel public function ecs()
  public ecs?: Ec[] = []; 
}
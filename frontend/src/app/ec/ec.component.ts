import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EcService } from '../service/ec-service.service';
import { Ec } from '../models/ec';
import { Ue } from '../models/ue';

@Component({
  selector: 'app-ec',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ec.component.html',
  styleUrls: ['./ec.component.css']
})
export class EcComponent implements OnInit {
  ecs: Ec[] = [];
  ues: Ue[] = []; 
  
  selectedEc: Ec | null = null;
  selectedFile: File | null = null;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;

  pagination: any = {
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0
  };

  constructor(private ecService: EcService) {}

  ngOnInit(): void {
    this.loadEcs();
    this.loadUes();
  }

  /**
   * ✅ TELECHARGEMENT PDF : Gère le téléchargement de l'image de l'EC
   */
  downloadPdf(codeEc: string | undefined): void {
    if (!codeEc) {
      console.error("Impossible de télécharger : Code EC manquant");
      return;
    }

    // On vérifie si l'EC correspondant a bien une image avant d'appeler le service
    const ec = this.ecs.find(e => e.code_ec === codeEc);
    
    if (ec && ec.image_ec) {
      this.ecService.downloadImagePdf(codeEc);
    } else {
      alert("Cet EC n'a pas d'image associée pour générer un PDF.");
    }
  }

  /**
   * ✅ EXPORT GLOBAL : Exporte la liste complète des EC
   */
  exportAllPdf(): void {
    const token = localStorage.getItem('token');
    // On ajoute le token en paramètre pour l'ouverture dans un nouvel onglet
    const url = `http://localhost:8000/api/ec/export-pdf?token=${token}`;
    window.open(url, '_blank'); 
  }

  loadUes(): void {
    this.ecService.getUes().subscribe({
      next: (data) => {
        this.ues = data;
      },
      error: (err) => console.error('Erreur chargement UE:', err)
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  loadEcs(page: number = 1): void {
    this.ecService.get(page, this.pagination.per_page).subscribe({
      next: (response) => {
        this.ecs = response.data;
        this.pagination = response.meta;
      },
      error: (err) => console.error('Erreur chargement EC:', err)
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;

    const formData = new FormData();
    formData.append('code_ec', form.value.code_ec);
    formData.append('label_ec', form.value.label_ec);
    formData.append('desc_ec', form.value.desc_ec || '');
    formData.append('nbh_ec', form.value.nbh_ec);
    formData.append('nbc_ec', form.value.nbc_ec);
    formData.append('code_ue', form.value.code_ue);
    
    if (this.selectedFile) {
      formData.append('image_ec', this.selectedFile);
    }

    this.ecService.save(formData).subscribe({
      next: () => {
        this.loadEcs(1);
        form.resetForm();
        this.selectedFile = null;
      },
      error: (err) => console.error('Erreur création EC:', err)
    });
  }

  // --- Gestion des Modals (Edit/Delete) ---

  openEditModal(ec: Ec) {
    this.selectedEc = { ...ec };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedEc = null;
    this.selectedFile = null;
  }

  saveEdit() {
    if (!this.selectedEc || !this.selectedEc.code_ec) return;

    const formData = new FormData();
    formData.append('code_ec', this.selectedEc.code_ec);
    formData.append('label_ec', this.selectedEc.label_ec!);
    formData.append('desc_ec', this.selectedEc.desc_ec || '');
    formData.append('nbh_ec', this.selectedEc.nbh_ec!.toString());
    formData.append('nbc_ec', this.selectedEc.nbc_ec!.toString());
    formData.append('code_ue', this.selectedEc.code_ue!);

    if (this.selectedFile) {
      formData.append('image_ec', this.selectedFile);
    }

    this.ecService.update(this.selectedEc.code_ec, formData).subscribe({
      next: () => {
        this.loadEcs(this.pagination.current_page);
        this.closeEditModal();
      },
      error: (err) => console.error('Erreur modification EC:', err)
    });
  }

  openDeleteModal(ec: Ec) {
    this.selectedEc = ec;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (!this.selectedEc || !this.selectedEc.code_ec) return;

    this.ecService.delete(this.selectedEc.code_ec).subscribe({
      next: () => {
        this.loadEcs(this.pagination.current_page);
        this.closeDeleteModal();
      },
      error: (err) => console.error('Erreur suppression EC:', err)
    });
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedEc = null;
  }

  // --- Navigation Pagination ---

  prevPage() {
    if (this.pagination.current_page > 1) {
      this.loadEcs(this.pagination.current_page - 1);
    }
  }

  nextPage() {
    if (this.pagination.current_page < this.pagination.last_page) {
      this.loadEcs(this.pagination.current_page + 1);
    }
  }
}
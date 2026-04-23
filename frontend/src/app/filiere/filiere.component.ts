import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FiliereService } from './../service/filiere.service';
import { Filiere } from '../models/filiere';

// Importations pour le PDF Client-side (jsPDF)
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-filiere',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filiere.component.html',
  styleUrls: ['./filiere.component.css']
})
export class FiliereComponent implements OnInit {
  filieres: Filiere[] = [];
  selectedFiliere: Filiere | null = null;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  isExporting: boolean = false;

  // Variables pour la pagination
  pagination: any = {
    current_page: 1,
    last_page: 1,
    per_page: 3,
    total: 0
  };

  constructor(private filiereService: FiliereService) {}

  ngOnInit(): void {
    this.loadFilieres();
  }

  /**
   * ✅ EXPORT PDF VIA BACKEND (Liste complète)
   */
  exportFullPDF(): void {
    this.isExporting = true;
    this.filiereService.exportPdf().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `full_filieres_${new Date().getTime()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
      },
      error: (err) => {
        console.error('Erreur export PDF:', err);
        this.isExporting = false;
      }
    });
  }

  /**
   * ✅ EXPORT EXCEL VIA BACKEND (Liste complète)
   */
  exportFullExcel(): void {
    this.isExporting = true;
    this.filiereService.exportExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `liste_filieres_${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
      },
      error: (err) => {
        console.error('Erreur export Excel:', err);
        this.isExporting = false;
      }
    });
  }

  /**
   * 📄 EXPORT PDF CLIENT-SIDE (Uniquement la page actuelle)
   */
  exportToPDF(): void {
    this.isExporting = true;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('RAPPORT DES FILIÈRES (Page Actuelle)', 14, 22);

    const tableColumn = ["Code Filière", "Label de la Filière", "Description"];
    const tableRows = this.filieres.map(f => [
      f.code_filiere || '',
      f.label_filiere || '',
      f.desc_filiere || 'N/A'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      headStyles: { fillColor: [13, 110, 253] }
    });

    doc.save(`page_filieres_${new Date().getTime()}.pdf`);
    this.isExporting = false;
  }

  // --- LOGIQUE CRUD EXISTANTE ---

  loadFilieres(page: number = 1): void {
    this.filiereService.get(page, this.pagination.per_page).subscribe({
      next: (data) => {
        this.filieres = data.filieres;
        this.pagination = data.pagination;
      },
      error: (err) => console.error('Erreur chargement:', err)
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    this.filiereService.save(form.value).subscribe({
      next: () => {
        this.loadFilieres(1); 
        form.resetForm();
      },
      error: (err) => console.error('Erreur ajout:', err)
    });
  }

  openEditModal(filiere: Filiere) {
    this.selectedFiliere = { ...filiere };
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedFiliere = null;
  }

  saveEdit() {
    if (!this.selectedFiliere) return;
    this.filiereService.update(this.selectedFiliere).subscribe({
      next: () => {
        this.loadFilieres(this.pagination.current_page);
        this.closeEditModal();
      },
      error: (err) => console.error('Erreur modification:', err)
    });
  }

  openDeleteModal(filiere: Filiere) {
    this.selectedFiliere = filiere;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    const code = this.selectedFiliere?.code_filiere;
    if (!code) return;
    this.filiereService.delete(code).subscribe({
      next: () => {
        this.loadFilieres(this.pagination.current_page);
        this.showDeleteModal = false;
        this.selectedFiliere = null;
      },
      error: (err) => console.error('Erreur suppression:', err)
    });
  }

  closeDeleteModal() { this.showDeleteModal = false; }
  prevPage() { if (this.pagination.current_page > 1) this.loadFilieres(this.pagination.current_page - 1); }
  nextPage() { if (this.pagination.current_page < this.pagination.last_page) this.loadFilieres(this.pagination.current_page + 1); }
}
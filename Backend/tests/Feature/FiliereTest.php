<?php

namespace Tests\Feature;

use App\Models\Filiere;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;
use Tests\Traits\ApiTokenTrait;

class FiliereTest extends TestCase
{
    use ApiTokenTrait, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // On authentifie systématiquement pour ces routes protégées
        $this->authenticatePersonnel();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_create_filiere()
    {
        $payload = [
            'code_filiere' => 'INFOS',
            'label_filiere' => 'Informatique',
            'desc_filiere' => 'Filière orientée développement et gestion',
        ];

        $response = $this->postJson('/api/filieres', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['message' => 'Filiere créée avec succès']);

        $this->assertDatabaseHas('filieres', ['code_filiere' => 'INFOS']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_list_filieres_with_pagination()
    {
        // On crée manuellement quelques filières (ou via une Factory si vous en avez une)
        Filiere::create(['code_filiere' => 'FIL01', 'label_filiere' => 'Filiere 1']);
        Filiere::create(['code_filiere' => 'FIL02', 'label_filiere' => 'Filiere 2']);

        $response = $this->getJson('/api/filieres?per_page=5');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'filieres',
                'pagination' => ['current_page', 'total', 'per_page'],
            ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_show_specific_filiere()
    {
        $filiere = Filiere::create([
            'code_filiere' => 'MATHS',
            'label_filiere' => 'Mathématiques',
            'desc_filiere' => 'Analyse et Algèbre',
        ]);

        $response = $this->getJson("/api/filieres/{$filiere->code_filiere}");

        $response->assertStatus(200)
            ->assertJson(['code_filiere' => 'MATHS']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_update_filiere()
    {
        $filiere = Filiere::create([
            'code_filiere' => 'BIO01',
            'label_filiere' => 'Biologie ancienne',
        ]);

        $response = $this->putJson("/api/filieres/{$filiere->code_filiere}", [
            'label_filiere' => 'Biologie Marine',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('filieres', [
            'code_filiere' => 'BIO01',
            'label_filiere' => 'Biologie Marine',
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_delete_filiere()
    {
        $filiere = Filiere::create([
            'code_filiere' => 'SUPPR',
            'label_filiere' => 'A Supprimer',
        ]);

        $response = $this->deleteJson("/api/filieres/{$filiere->code_filiere}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Suppression réussie']);

        $this->assertDatabaseMissing('filieres', ['code_filiere' => 'SUPPR']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_export_pdf_returns_success()
    {
        // Créer une donnée pour l'export
        Filiere::create(['code_filiere' => 'EXPORT', 'label_filiere' => 'Export Test']);

        $response = $this->get('/api/filieres/export/pdf');

        // On vérifie que c'est bien un fichier PDF qui est retourné
        $response->assertStatus(200)
            ->assertHeader('content-type', 'application/pdf');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_export_excel_uses_excel_facade()
    {
        Excel::fake(); // On simule Excel pour ne pas générer de vrai fichier

        $response = $this->get('/api/filieres/export/excel');

        $response->assertStatus(200);

        // On vérifie que l'export a bien été appelé avec le bon nom de fichier
        Excel::assertDownloaded('liste_filieres.xlsx');
    }
}

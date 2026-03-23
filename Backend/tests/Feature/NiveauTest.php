<?php

namespace Tests\Feature;

use App\Models\Filiere;
use App\Models\Niveau;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\ApiTokenTrait;

class NiveauTest extends TestCase
{
    use ApiTokenTrait, RefreshDatabase;

    protected $filiere;

    protected function setUp(): void
    {
        parent::setUp();

        // 1. Authentification
        $this->authenticatePersonnel();

        // 2. Utilisation de la factory sans forcer le code_filiere
        // pour éviter les conflits d'unicité entre les tests
        $this->filiere = Filiere::factory()->create();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_list_niveaux_with_pagination()
    {
        Niveau::factory()->count(15)->create();

        $response = $this->getJson('/api/niveaux');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data',
                'current_page',
                'last_page',
                'per_page',
            ])
            ->assertJsonCount(10, 'data');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_create_niveau()
    {
        $payload = [
            'label_niveau' => 'Licence 3 Informatique',
            'desc_niveau' => 'Troisième année de licence',
            'code_filiere' => $this->filiere->code_filiere,
        ];

        $response = $this->postJson('/api/niveaux', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.label_niveau', 'Licence 3 Informatique');

        $this->assertDatabaseHas('niveaux', [
            'label_niveau' => 'Licence 3 Informatique',
            'code_filiere' => $this->filiere->code_filiere,
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_show_specific_niveau()
    {
        $niveau = Niveau::factory()->create([
            'label_niveau' => 'Master 1 Architecture',
        ]);

        $response = $this->getJson("/api/niveaux/{$niveau->code_niveau}");

        $response->assertStatus(200)
            ->assertJsonPath('data.label_niveau', 'Master 1 Architecture');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_update_niveau_details()
    {
        $niveau = Niveau::factory()->create(['label_niveau' => 'Ancien Niveau']);

        $response = $this->putJson("/api/niveaux/{$niveau->code_niveau}", [
            'label_niveau' => 'Niveau Mis à Jour',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('niveaux', [
            'code_niveau' => $niveau->code_niveau,
            'label_niveau' => 'Niveau Mis à Jour',
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_delete_niveau()
    {
        $niveau = Niveau::factory()->create();

        $response = $this->deleteJson("/api/niveaux/{$niveau->code_niveau}");

        $response->assertStatus(200)
            ->assertJson(['message' => 'Niveau supprimé avec succès']);

        $this->assertDatabaseMissing('niveaux', [
            'code_niveau' => $niveau->code_niveau,
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_cannot_create_niveau_with_invalid_filiere()
    {
        $payload = [
            'label_niveau' => 'Niveau Invalide',
            'code_filiere' => 'NON-EXISTENT-FILIERE',
        ];

        $response = $this->postJson('/api/niveaux', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code_filiere']);
    }
}

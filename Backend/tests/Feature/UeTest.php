<?php

namespace Tests\Feature;

use App\Models\Ue;
use App\Models\Niveau;
use App\Models\Filiere;
use Tests\TestCase;
use Tests\Traits\ApiTokenTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UeTest extends TestCase
{
    use RefreshDatabase, ApiTokenTrait;

    protected $niveau;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authenticatePersonnel();

        $filiere = Filiere::firstOrCreate(['code_filiere' => 'FIL-INF'], ['label_filiere' => 'Informatique']);
        $this->niveau = Niveau::firstOrCreate(['code_niveau' => 'NIV-L3'], [
            'label_niveau' => 'Licence 3', 
            'code_filiere' => $filiere->code_filiere
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_list_ues_with_pagination()
    {
        Ue::factory()->count(3)->create(['code_niveau' => $this->niveau->code_niveau]);

        $response = $this->getJson('/api/ues'); // Corrigé : ues au lieu de Ue

        $response->assertStatus(200)
                 ->assertJsonStructure(['data', 'current_page', 'last_page']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_create_ue()
    {
        $payload = [
            'code_ue'     => 'UE-MATH1',
            'label_ue'    => 'Mathématiques discrètes',
            'code_niveau' => $this->niveau->code_niveau,
        ];

        $response = $this->postJson('/api/ues', $payload); // Corrigé : ues

        $response->assertStatus(201);
        $this->assertDatabaseHas('ues', ['code_ue' => 'UE-MATH1']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_show_specific_ue()
    {
        $ue = Ue::create([
            'code_ue' => 'UE-INF501', 'label_ue' => 'Réseaux', 'code_niveau' => $this->niveau->code_niveau
        ]);

        $response = $this->getJson("/api/ues/{$ue->code_ue}"); // Déjà correct

        $response->assertStatus(200);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_delete_ue()
    {
        $ue = Ue::create([
            'code_ue' => 'UE-DELETE', 'label_ue' => 'Suppr', 'code_niveau' => $this->niveau->code_niveau
        ]);

        $response = $this->deleteJson("/api/ues/{$ue->code_ue}"); // Corrigé : ues au lieu de Ue

        $response->assertStatus(200);
        $this->assertDatabaseMissing('ues', ['code_ue' => 'UE-DELETE']);
    }
}
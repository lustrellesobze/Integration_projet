<?php

namespace Tests\Feature;

use App\Models\Ec;
use App\Models\Ue;
use App\Models\Salle;
use App\Models\Personnel;
use App\Models\Programmation;
use App\Models\Niveau;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\ApiTokenTrait;

class ProgrammationTest extends TestCase
{
    use RefreshDatabase, ApiTokenTrait;

    protected $ec;
    protected $ue;
    protected $salle;
    protected $personnel;

    protected function setUp(): void
    {
        parent::setUp();

        // Authentification
        $this->authenticatePersonnel();

        // Créer un Niveau
        $niveau = Niveau::factory()->create();

        // Créer une UE associée au Niveau
        $this->ue = Ue::factory()->create([
            'code_niveau' => $niveau->code_niveau,
        ]);

        // Créer un EC associé à l’UE
        $this->ec = Ec::factory()->create([
            'code_ue' => $this->ue->code_ue,
        ]);

        // Créer Salle et Personnel
        $this->salle = Salle::factory()->create();
        $this->personnel = Personnel::factory()->create();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function can_list_programmations()
    {
        Programmation::factory()->count(3)->create([
            'code_ec'   => $this->ec->code_ec,
            'num_salle' => $this->salle->num_salle,
            'code_pers' => $this->personnel->code_pers,
        ]);

        $response = $this->getJson('/api/programmations');

        $response->assertStatus(200)
                 ->assertJsonCount(3, 'data');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function can_create_programmation()
    {
        $payload = [
            'code_ec'     => $this->ec->code_ec,
            'num_salle'   => $this->salle->num_salle,
            'code_pers'   => $this->personnel->code_pers,
            'date'        => now()->addDay()->format('Y-m-d'),
            'heure_debut' => '08:00',
            'heure_fin'   => '10:00',
            'nbre_heure'  => 2,
            'status'      => 'Programmé',
        ];

        $response = $this->postJson('/api/programmations', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.status', 'Programmé');

        $this->assertDatabaseHas('programmations', [
            'code_ec'   => $this->ec->code_ec,
            'num_salle' => $this->salle->num_salle,
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function can_show_specific_programmation()
    {
        $programmation = Programmation::factory()->create([
            'code_ec'   => $this->ec->code_ec,
            'num_salle' => $this->salle->num_salle,
            'code_pers' => $this->personnel->code_pers,
        ]);

        $response = $this->getJson("/api/programmations/{$programmation->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $programmation->id);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function can_update_programmation()
    {
        $programmation = Programmation::factory()->create([
            'code_ec'   => $this->ec->code_ec,
            'num_salle' => $this->salle->num_salle,
            'code_pers' => $this->personnel->code_pers,
            'status'    => 'Programmé',
        ]);

        $response = $this->putJson("/api/programmations/{$programmation->id}", [
            'status' => 'Terminé',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('programmations', [
            'id'     => $programmation->id,
            'status' => 'Terminé',
        ]);
    }
}
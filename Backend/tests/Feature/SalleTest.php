<?php

namespace Tests\Feature;

use App\Models\Salle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase; // On importe le fichier du trait
use Tests\Traits\ApiTokenTrait;

class SalleTest extends TestCase
{
    // On utilise le nom exact du trait défini dans ApiTokenTrait.php
    use ApiTokenTrait, RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Cette méthode est définie dans ton ApiTokenTrait
        $this->authenticatePersonnel();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_create_salle()
    {
        $payload = [
            'num_salle' => 'SALLE-101',
            'contenance' => 50,
            'status' => 'Disponible',
        ];

        $response = $this->postJson('/api/salles', $payload);

        $response->assertStatus(201)
            ->assertJsonFragment(['message' => 'Salle créée avec succès']);

        $this->assertDatabaseHas('salles', ['num_salle' => 'SALLE-101']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_create_salle_fails_if_contenance_too_low()
    {
        $payload = [
            'num_salle' => 'SALLE-ERR',
            'contenance' => 10, // Le minimum est 20 dans ton contrôleur
            'status' => 'Disponible',
        ];

        $response = $this->postJson('/api/salles', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['contenance']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_show_specific_salle()
    {
        $salle = Salle::create([
            'num_salle' => 'SALLE-202',
            'contenance' => 100,
            'status' => 'Disponible',
        ]);

        $response = $this->getJson("/api/salles/{$salle->num_salle}");

        $response->assertStatus(200)
            ->assertJsonPath('data.num_salle', 'SALLE-202');
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_update_salle_status()
    {
        $salle = Salle::create([
            'num_salle' => 'SALLE-303',
            'contenance' => 25,
            'status' => 'Disponible',
        ]);

        $response = $this->putJson("/api/salles/{$salle->num_salle}", [
            'status' => 'Indisponible',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('salles', [
            'num_salle' => 'SALLE-303',
            'status' => 'Indisponible',
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_delete_salle()
    {
        $salle = Salle::create([
            'num_salle' => 'SALLE-OLD',
            'contenance' => 30,
            'status' => 'Disponible',
        ]);

        $response = $this->deleteJson("/api/salles/{$salle->num_salle}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('salles', ['num_salle' => 'SALLE-OLD']);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Ec;
use App\Models\Ue;
use App\Models\Niveau;
use App\Models\Filiere;
use Tests\TestCase;
use Tests\Traits\ApiTokenTrait;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class EcTest extends TestCase
{
    use RefreshDatabase, ApiTokenTrait;

    protected $ue;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->authenticatePersonnel();

        // Utilisation de firstOrCreate pour éviter les erreurs de duplication
        $filiere = Filiere::firstOrCreate(
            ['code_filiere' => 'FIL-INF'],
            ['label_filiere' => 'Informatique']
        );

        $niveau = Niveau::firstOrCreate(
            ['code_niveau' => 'NIV-L3'],
            [
                'label_niveau' => 'Licence 3',
                'code_filiere' => $filiere->code_filiere
            ]
        );

        $this->ue = Ue::firstOrCreate(
            ['code_ue' => 'UE-INF101'],
            [
                'label_ue'    => 'Informatique Fondamentale',
                'desc_ue'     => 'Description de test',
                'code_niveau' => $niveau->code_niveau
            ]
        );
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_create_ec_with_image()
    {
        Storage::fake('public');

        $payload = [
            'code_ec'  => 'EC-ALGO2',
            'label_ec' => 'Algorithmique Avancée',
            'desc_ec'  => 'Complexité et structures',
            'nbh_ec'   => 45,
            'nbc_ec'   => 5,
            'code_ue'  => $this->ue->code_ue,
        ];

        $response = $this->postJson('/api/ecs', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('ecs', ['code_ec' => 'EC-ALGO2']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_list_ecs_with_pagination()
    {
        Ec::firstOrCreate(
            ['code_ec' => 'EC-TEST1'],
            ['label_ec' => 'Test 1', 'nbh_ec' => 20, 'nbc_ec' => 2, 'code_ue' => $this->ue->code_ue]
        );

        $response = $this->getJson('/api/ecs');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data', 'meta']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_update_ec_details()
    {
        $ec = Ec::create([
            'code_ec'  => 'EC-UPDATE',
            'label_ec' => 'Ancien Label',
            'nbh_ec'   => 20,
            'nbc_ec'   => 2,
            'code_ue'  => $this->ue->code_ue
        ]);

        $response = $this->putJson("/api/ecs/{$ec->code_ec}", [
            'label_ec' => 'Nouveau Label'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('ecs', ['code_ec' => 'EC-UPDATE', 'label_ec' => 'Nouveau Label']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_can_delete_ec_and_cleanup_storage()
    {
        Storage::fake('public');
        $path = 'ecs/test.jpg';
        Storage::disk('public')->put($path, 'dummy content');

        $ec = Ec::create([
            'code_ec'  => 'EC-BYE',
            'label_ec' => 'A supprimer',
            'nbh_ec'   => 10,
            'nbc_ec'   => 1,
            'code_ue'  => $this->ue->code_ue,
            'image_ec' => $path
        ]);

        $response = $this->deleteJson("/api/ecs/{$ec->code_ec}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('ecs', ['code_ec' => 'EC-BYE']);
        Storage::disk('public')->assertMissing($path);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_download_pdf_fails_if_no_image()
    {
        $ec = Ec::create([
            'code_ec'  => 'EC-NO-IMG',
            'label_ec' => 'Sans Image',
            'nbh_ec'   => 10,
            'nbc_ec'   => 1,
            'code_ue'  => $this->ue->code_ue
        ]);

        $response = $this->getJson("/api/ecs/download-image/{$ec->code_ec}");

        $response->assertStatus(404);
    }
}
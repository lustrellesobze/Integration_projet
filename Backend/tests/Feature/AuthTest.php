<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Personnel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function test_login_success()
    {
        // 1. Créer un personnel
        $personnel = Personnel::create([
            'code_pers'   => 'Pers-' . uniqid(),
            'nom_pers'   => 'Kaka',
            'sexe_pers'   => 'Masculin',
            'phone_pers'   => '658788445',
            'login_pers' => 'chris_test',
            'pwd_pers'   => Hash::make('secret123'),
            'type_pers'=> 'RESPONSABLE DISCIPLINE',

        ]);

        // 2. Tenter la connexion via l'API
        $response = $this->postJson('/api/login', [
            'login_pers' => 'chris_test',
            'pwd_pers'   => 'secret123',
        ]);

        // 3. Vérifications
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'personnel',
                     'access_token',
                     'token_type'
                 ]);
    }

   #[\PHPUnit\Framework\Attributes\Test]
public function test_login_fails_with_wrong_password()
{
    $personnel = Personnel::create([
        'code_pers'  => 'Pers-ERR',
        'nom_pers'   => 'Test',
        'sexe_pers'  => 'Masculin',
        'phone_pers' => '000000000',
        'type_pers'  => 'ENSEIGNANT',
        'login_pers' => 'wrong_user',
        'pwd_pers'   => Hash::make('correct_password'),
    ]);

    $response = $this->postJson('/api/login', [
        'login_pers' => 'wrong_user',
        'pwd_pers'   => 'wrong_password',
    ]);

    $response->assertStatus(401)
             ->assertJson(['message' => 'Identifiants invalides']);
}
}
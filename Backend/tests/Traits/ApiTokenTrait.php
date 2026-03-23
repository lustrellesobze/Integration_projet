<?php

namespace Tests\Traits;

use App\Models\Personnel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;

trait ApiTokenTrait
{
    protected function authenticatePersonnel(): Personnel
    {
        // On nettoie
        Personnel::where('login_pers', 'test_admin')->delete();

        $personnel = Personnel::create([
            'id' => (string) Str::uuid(),
            'code_pers' => 'Pers-'.Str::random(5), // Champ obligatoire
            'nom_pers' => 'Admin Test',
            'sexe_pers' => 'Masculin',            // Champ obligatoire (enum)
            'phone_pers' => '677000000',           // Champ obligatoire
            'login_pers' => 'test_admin',
            'pwd_pers' => Hash::make('password123'),
            'type_pers' => 'RESPONSABLE ACADEMIQUE', // Champ obligatoire (enum)
        ]);

        Sanctum::actingAs($personnel, [], 'sanctum');

        return $personnel;
    }
}

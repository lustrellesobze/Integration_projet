<?php

namespace Database\Seeders;

use App\Models\Personnel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // Import important

class PersonnelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Personnel::create([
            'id' => (string) Str::uuid(), // On force l'UUID ici
            'code_pers' => 'Pers002',
            'nom_pers' => 'Lustrelle',
            'sexe_pers' => 'Feminin',
            'phone_pers' => '690000000',
            'login_pers' => 'maffo@75gmail.com',
            'pwd_pers' => Hash::make('12345'),
            'type_pers' => 'ENSEIGNANT',
        ]);
    }
}
// 

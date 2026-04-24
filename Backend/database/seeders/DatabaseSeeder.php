<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // On appelle le seeder du personnel ici
        $this->call([
            PersonnelSeeder::class,
        ]);

        // Tu pourras ajouter les autres seeders ici au fur et à mesure :
        // $this->call([
        //     FiliereSeeder::class,
        //     NiveauSeeder::class,
        //     UeSeeder::class,
        // ]);
    }
}

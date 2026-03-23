<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FiliereController;
use App\Http\Controllers\NiveauController;
use App\Http\Controllers\UeController;
use App\Http\Controllers\EcController;
use App\Http\Controllers\SalleController;
use App\Http\Controllers\ProgrammationController;
use App\Http\Controllers\PersonnelController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EnseigneController;

// --- Routes Publiques ---
Route::post('/login', [AuthController::class, 'login']);
Route::apiResource("personnels", PersonnelController::class);


// --- Routes Sécurisées (Sanctum) ---
// --- Routes Sécurisées (Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Ressources API (Harmonisées au pluriel)
    Route::apiResource("enseignes", EnseigneController::class);
    Route::apiResource("niveaux", NiveauController::class);
    Route::apiResource("ecs", EcController::class); // Changé de 'ec' à 'ecs'
    Route::apiResource("ues", UeController::class); // Changé de 'Ue' à 'ues'
    Route::apiResource("salles", SalleController::class);
    Route::apiResource("programmations", ProgrammationController::class);

    // Routes d'exportation
    Route::get('filieres/export/pdf', [FiliereController::class, 'exportPdf']);
    Route::get('filieres/export/excel', [FiliereController::class, 'exportExcel']);
    Route::apiResource("filieres", FiliereController::class);

    // Route spécifique pour l'image (Utilisation du pluriel ecs pour la cohérence)
    Route::get('/ecs/download-image/{id}', [EcController::class, 'downloadImagePdf']);
});
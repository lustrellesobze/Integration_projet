<?php

namespace App\Http\Controllers;

use App\Models\Ue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UeController extends Controller
{
    public function index()
    {
        Log::channel('audit')->info('Consultation de la liste des UEs.');
        // Utilisation de paginate pour correspondre aux attentes des tests de pagination
        $ues = Ue::paginate(10);

        return response()->json($ues, 200);
    }

    public function store(Request $request)
    {
        Log::channel('audit')->info("Tentative de création d'une nouvelle UE.", $request->all());

        $validateData = $request->validate([
            'code_ue' => 'required|min:5|string|unique:ues,code_ue',
            'label_ue' => 'required|min:5|string',
            'desc_ue' => 'nullable|string',
            'code_niveau' => 'required|exists:niveaux,code_niveau',
        ]);

        $ue = Ue::create($validateData);

        Log::channel('audit')->notice('UE créée avec succès.', [
            'code_ue' => $ue->code_ue,
            'label' => $ue->label_ue,
        ]);

        return response()->json([
            'message' => 'UE créée avec succès',
            'data' => $ue,
        ], 201);
    }

    /**
     * Correction : On utilise Ue $ue (Route Model Binding)
     * Laravel cherchera automatiquement via 'code_ue'
     */
    public function show(Ue $ue)
    {
        Log::channel('audit')->info("Consultation des détails de l'UE: {$ue->code_ue}");

        return response()->json(['data' => $ue], 200);
    }

    /**
     * Correction : Validation unique corrigée pour ignorer le code_ue actuel
     */
    public function update(Request $request, Ue $ue)
    {
        Log::channel('audit')->info("Tentative de mise à jour de l'UE : {$ue->code_ue}");

        $validateData = $request->validate([
            // On ignore l'enregistrement actuel via sa clé primaire string 'code_ue'
            'code_ue' => 'sometimes|string|min:5|unique:ues,code_ue,'.$ue->code_ue.',code_ue',
            'label_ue' => 'sometimes|string|min:5',
            'desc_ue' => 'nullable|string',
            'code_niveau' => 'sometimes|exists:niveaux,code_niveau',
        ]);

        $ue->update($validateData);

        Log::channel('audit')->info("UE {$ue->code_ue} mise à jour avec succès.");

        return response()->json([
            'message' => 'UE mise à jour avec succès',
            'data' => $ue,
        ], 200);
    }

    public function destroy(Ue $ue)
    {
        $codeUe = $ue->code_ue;
        Log::channel('audit')->info("Demande de suppression de l'UE : $codeUe");

        $ue->delete();

        Log::channel('audit')->notice("UE supprimée définitivement : $codeUe");

        return response()->json([
            'message' => 'UE supprimée avec succès',
        ], 200);
    }
}

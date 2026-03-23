<?php

namespace App\Http\Controllers;

use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NiveauController extends Controller
{
    public function index()
    {
        Log::channel('audit')->info('Consultation de la liste des niveaux.');
        // Pagination ajoutée pour la cohérence avec les autres ressources
        $niveaux = Niveau::paginate(10);

        return response()->json($niveaux, 200);
    }

    public function store(Request $request)
    {
        Log::channel('audit')->info("Tentative de création d'un niveau.", $request->all());

        $validateData = $request->validate([
            'label_niveau' => 'required|min:5|string',
            'desc_niveau' => 'nullable|string',
            'code_filiere' => 'required|string|exists:filieres,code_filiere',
        ]);

        $niveau = Niveau::create($validateData);

        return response()->json([
            'message' => 'Niveau créé avec succès',
            'data' => $niveau,
        ], 201);
    }

    public function show(Niveau $niveau)
    {
        return response()->json(['data' => $niveau], 200);
    }

    public function update(Request $request, Niveau $niveau)
    {
        Log::channel('audit')->info("Mise à jour du niveau ID: {$niveau->code_niveau}");

        $validateData = $request->validate([
            'label_niveau' => 'sometimes|string|min:5',
            'desc_niveau' => 'nullable|string',
            'code_filiere' => 'sometimes|string|exists:filieres,code_filiere',
        ]);

        $niveau->update($validateData);

        return response()->json([
            'message' => 'Niveau mis à jour avec succès',
            'data' => $niveau,
        ], 200);
    }

    public function destroy(Niveau $niveau)
    {
        Log::channel('audit')->notice("Suppression du niveau ID: {$niveau->code_niveau}");

        $niveau->delete();

        return response()->json(['message' => 'Niveau supprimé avec succès'], 200);
    }
}

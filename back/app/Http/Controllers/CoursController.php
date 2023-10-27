<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CoursController extends Controller
{
    /**
     * Affiche la liste des cours avec le nom de l'unité d'enseignement et du professeur.
     */
    public function index()
{
    $cours = Cours::join('unite_enseign', 'cours.id_unite', '=', 'unite_enseign.id_unite')
        ->join('users', 'cours.id_prof', '=', 'users.id') // Jointure avec la table "users"
        ->select('cours.*', 'unite_enseign.nom_unite', 'users.name as nom_professeur') // Sélection du nom d'utilisateur
        ->get();

    return response()->json([
        'cours' => $cours,
        'status' => 200
    ], 200);
}

    /**
     * Crée un nouveau cours.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'libelle' => 'required|string',
            'image_cours' => 'nullable|binary',
            'fichier_cours' => 'nullable|binary',
            'video_cours' => 'nullable|binary',
            'id_prof' => 'required|integer',
            'id_unite' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ], 400);
        }

        try {
            Cours::create([
                'libelle' => $request->libelle,
                'image_cours' => $request->image_cours,
                'fichier_cours' => $request->fichier_cours,
                'video_cours' => $request->video_cours,
                'id_prof' => $request->id_prof,
                'id_unite' => $request->id_unite,
            ]);

            return response()->json([
                'message' => "Le cours a été créé avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a eu une erreur lors de l'insertion du cours",
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un cours spécifique avec le nom de l'unité d'enseignement et du professeur.
     */
    public function show(int $id)
{
    $cours = Cours::join('unite_enseign', 'cours.id_unite', '=', 'unite_enseign.id_unite')
        ->join('users', 'cours.id_prof', '=', 'users.id') // Jointure avec la table "users"
        ->where('cours.code_matiere', $id)
        ->select('cours.*', 'unite_enseign.nom_unite', 'users.name as nom_professeur') // Sélection du nom d'utilisateur
        ->first();

    if (!$cours) {
        return response()->json([
            'message' => "Ce cours n'a pas été trouvé",
            'status' => 404,
        ]);
    }

    return response()->json([
        'cours' => $cours,
        'status' => 200,
    ]);
}

    /**
     * Met à jour les informations d'un cours.
     */
    public function update(Request $request, int $id)
    {
        try {
            $cours = Cours::find($id);

            if (!$cours) {
                return response()->json([
                    'message' => "Le cours n'existe pas",
                ], 404);
            } else {
                $validator = Validator::make($request->all(), [
                    'libelle' => 'required|string',
                    'image_cours' => 'nullable|binary',
                    'fichier_cours' => 'nullable|binary',
                    'video_cours' => 'nullable|binary',
                    'id_prof' => 'required|integer',
                    'id_unite' => 'required|integer',
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 400,
                        'error_list' => $validator->messages(),
                    ], 400);
                } else {
                    $cours->libelle = $request->libelle;
                    $cours->image_cours = $request->image_cours;
                    $cours->fichier_cours = $request->fichier_cours;
                    $cours->video_cours = $request->video_cours;
                    $cours->id_prof = $request->id_prof;
                    $cours->id_unite = $request->id_unite;
                    $cours->save();

                    return response()->json([
                        'message' => "Les informations du cours ont été mises à jour avec succès",
                        'status' => 200,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification du cours",
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Supprime un cours.
     */
    public function destroy(int $id)
    {
        $cours = Cours::find($id);
        if (!$cours) {
            return response()->json([
                'message' => "Ce cours n'a pas été trouvé",
                'status' => 404,
            ]);
        }

        $cours->delete();

        return response()->json([
            'message' => "Cours supprimé avec succès",
            'status' => 200,
        ], 200);
    }
}

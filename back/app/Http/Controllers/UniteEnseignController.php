<?php

namespace App\Http\Controllers;

use App\Models\UniteEnseign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UniteEnseignController extends Controller
{
    /**
     * Affiche la liste des unités d'enseignement.
     */
    public function index()
    {
        $unites = UniteEnseign::join('filieres', 'unite_enseign.id_filiere', '=', 'filieres.id_filiere')
            ->select('unite_enseign.*', 'filieres.nom_filiere')
            ->get();
    
        return response()->json([
            'unites' => $unites,
            'status' => 200
        ], 200);
    }

    /**
     * Crée une nouvelle unité d'enseignement.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom_unite' => 'required|string',
            'id_filiere' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ], 400);
        }

        try {
            UniteEnseign::create([
                'nom_unite' => $request->nom_unite,
                'id_filiere' => $request->id_filiere,
            ]);

            return response()->json([
                'message' => "L'unité d'enseignement a été créée avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a eu une erreur lors de l'insertion de l'unité d'enseignement",
            ], 500);
        }
    }

    /**
     * Affiche les détails d'une unité d'enseignement spécifique.
     */
    public function show(int $id)
    {
        $unite = UniteEnseign::join('filieres', 'unite_enseign.id_filiere', '=', 'filieres.id_filiere')
            ->where('unite_enseign.id_unite', $id)
            ->select('unite_enseign.*', 'filieres.nom_filiere')
            ->first();
    
        if (!$unite) {
            return response()->json([
                'message' => "Cette unité d'enseignement n'a pas été trouvée",
                'status' => 404,
            ]);
        }
    
        return response()->json([
            'unite' => $unite,
            'status' => 200,
        ]);
    }

    /**
     * Met à jour les informations d'une unité d'enseignement.
     */
    public function update(Request $request, int $id)
    {
        try {
            $unite = UniteEnseign::find($id);

            if (!$unite) {
                return response()->json([
                    'message' => "L'unité d'enseignement n'existe pas",
                ], 404);
            } else {
                $validator = Validator::make($request->all(), [
                    'nom_unite' => 'required|string',
                    'id_filiere' => 'required|integer',
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 400,
                        'error_list' => $validator->messages(),
                    ], 400);
                } else {
                    $unite->nom_unite = $request->nom_unite;
                    $unite->id_filiere = $request->id_filiere;
                    $unite->save();

                    return response()->json([
                        'message' => "Les informations de l'unité d'enseignement ont été mises à jour avec succès",
                        'status' => 200,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification de l'unité d'enseignement",
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Supprime une unité d'enseignement.
     */
    public function destroy(int $id)
    {
        $unite = UniteEnseign::find($id);
        if (!$unite) {
            return response()->json([
                'message' => "Cette unité d'enseignement n'a pas été trouvée",
                'status' => 404,
            ]);
        }

        $unite->delete();

        return response()->json([
            'message' => "Unité d'enseignement supprimée avec succès",
            'status' => 200,
        ], 200);
    }
}

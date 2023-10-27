<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Professeur;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class ProfesseurController extends Controller
{
    /**
     * Affiche la liste des professeurs.
     */
    public function index()
    {
        $professeurs = Professeur::join('users', 'professeurs.user_id', '=', 'users.id')
            ->select('professeurs.id_prof', 'professeurs.matiere_enseign', 'users.*')
            ->get();

        return response()->json([
            'professeurs' => $professeurs,
            'status' => 200
        ], 200);
    }

    /**
     * Crée un nouveau professeur.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'matiere_enseign' => 'required|string',
            'user_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }

        try {
            Professeur::create([
                'matiere_enseign' => $request->matiere_enseign,
                'user_id' => $request->user_id
            ]);

            return response()->json([
                'message' => "Le professeur a été créé avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion"
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un professeur spécifique.
     */
   
    public function show(int $id)
    {
        $professeur = Professeur::join('users', 'professeurs.user_id', '=', 'users.id')
            ->where('professeurs.id_prof', $id)
            ->select('professeurs.id_prof', 'professeurs.matiere_enseign', 'users.*')
            ->first();

        if (!$professeur) {
            return response()->json([
                'message' => 'Ce professeur n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        return response()->json([
            'professeur' => $professeur,
            'status' => 200,
        ]);
    }

    /**
     * Met à jour les informations d'un professeur.
     */
    public function update(Request $request, int $id)
    {
        try {
            $professeur = Professeur::find($id);

            if (!$professeur) {
                return response()->json([
                    'message' => "Le professeur n'existe pas",
                    'status' => 404,
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'matiere_enseign' => 'required|string',
                    'user_id' => 'required',
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 400,
                        'error_list' => $validator->messages(),
                    ], 400);
                } else {
                    $professeur->matiere_enseign = $request->matiere_enseign;
                    $professeur->user_id = $request->user_id;
                    $professeur->save();

                    return response()->json([
                        'message' => "Les informations du professeur ont été mises à jour avec succès",
                        'status' => 200,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification du professeur",
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Supprime un professeur.
     */
    public function destroy(int $id)
    {
        $professeur = Professeur::find($id);

        if (!$professeur) {
            return response()->json([
                'message' => 'Ce professeur n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        $professeur->delete();

        return response()->json([
            'message' => "Professeur supprimé avec succès",
            'status' => 200,
        ], 200);
    }
}

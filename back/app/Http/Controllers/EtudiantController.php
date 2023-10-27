<?php

namespace App\Http\Controllers;

use App\Http\Requests\TechnicienStoreRequest;
use App\Models\Etudiant;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class EtudiantController extends Controller
{
    /**
     * Affiche la liste des étudiants.
     */
    public function index()
    {
        $etudiants = Etudiant::join('users', 'etudiants.id_user', '=', 'users.id')
            ->join('filieres', 'etudiants.id_filiere', '=', 'filieres.id_filiere') // Jointure avec la table "filieres"
            ->select('etudiants.num_inscription', 'etudiants.niveau', 'etudiants.parcours', 'filieres.nom_filiere', 'users.name as nom_utilisateur')
            ->get();

        return response()->json([
            'etudiants' => $etudiants,
            'status' => 200
        ], 200);
    }

    /**
     * Crée un nouvel étudiant.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'niveau' => 'required|string',
            'parcours' => 'required|string',
            'id_filiere' => 'required|integer', // Modifier le nom du champ
            'id_user' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }

        try {
            Etudiant::create([
                'niveau' => $request->niveau,
                'parcours' => $request->parcours,
                'id_filiere' => $request->id_filiere, // Modifier le nom du champ
                'id_user' => $request->id_user
            ]);

            return response()->json([
                'message' => "L'étudiant a été créé avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion",
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un étudiant spécifique.
     */
    public function show(int $id)
    {
        $etudiant = Etudiant::join('users', 'etudiants.id_user', '=', 'users.id')
            ->join('filieres', 'etudiants.id_filiere', '=', 'filieres.id_filiere') // Jointure avec la table "filieres"
            ->where('etudiants.num_inscription', $id)
            ->select('etudiants.num_inscription', 'etudiants.niveau', 'etudiants.parcours', 'filieres.*', 'users.*')
            ->first();
    
        if (!$etudiant) {
            return response()->json([
                'message' => "Cet étudiant n'a pas été trouvé",
                'status' => 404,
            ]);
        }
    
        return response()->json([
            'etudiant' => $etudiant,
            'status' => 200,
        ]);
    }
    
    public function update(Request $request, int $id)
    {
        try {
            $etudiant = Etudiant::find($id);
    
            if (!$etudiant) {
                return response()->json([
                    'message' => "L'étudiant n'existe pas",
                ], 404);
            } else {
                $validator = Validator::make($request->all(), [
                    'niveau' => 'required|string',
                    'parcours' => 'required|string',
                    'id_filiere' => 'required|integer',
                    'id_user' => 'required|integer',
                ]);
    
                if ($validator->fails()) {
                    return response()->json([
                        'status' => 400,
                        'error_list' => $validator->messages(),
                    ], 400);
                } else {
                    $etudiant->niveau = $request->niveau;
                    $etudiant->parcours = $request->parcours;
                    $etudiant->id_filiere = $request->id_filiere;
                    $etudiant->id_user = $request->id_user;
                    $etudiant->save();
    
                    return response()->json([
                        'message' => "Les informations de l'étudiant ont été mises à jour avec succès",
                        'status' => 200,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification de l'étudiant",
                'status' => 500,
            ], 500);
        }
    }
    

    /**
     * Supprime un étudiant.
     */
    public function destroy(int $id)
    {
        $etudiant = Etudiant::find($id);
        if (!$etudiant) {
            return response()->json([
                'message' => "Cet étudiant n'a pas été trouvé",
                'status' => 404,
            ]);
        }

        $etudiant->delete();

        return response()->json([
            'message' => "Étudiant supprimé avec succès",
            'status' => 200,
        ], 200);
    }
}

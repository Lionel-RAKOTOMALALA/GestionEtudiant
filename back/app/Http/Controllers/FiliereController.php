<?php 
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Filiere; 

    class FiliereController extends Controller
    {
        /**
         * Affiche la liste des filières.
         */
        public function index()
        {
            $filieres = Filiere::all();
    
            return response()->json([
                'filieres' => $filieres,
                'status' => 200
            ], 200);
        }

        /**
         * Crée une nouvelle filière.
         */
        public function store(Request $request)
        {
            $request->validate([
                'nom_filiere' => 'required|string',
            ]);

            try {
                Filiere::create([
                    'nom_filiere' => $request->nom_filiere,
                ]);

                return response()->json([
                    'message' => "La filière a été créée avec succès",
                    'status' => 200
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => "Il y a une erreur dans l'insertion",
                ], 500);
            }
        }

        /**
         * Affiche les détails d'une filière spécifique.
         */
        public function show($id)
        {
            $filiere = Filiere::find($id);

            if (!$filiere) {
                return response()->json([
                    'message' => 'Cette filière n\'a pas été trouvée',
                    'status' => 404,
                ]);
            }

            return response()->json([
                'filiere' => $filiere,
                'status' => 200,
            ]);
        }

        /**
         * Met à jour les informations d'une filière.
         */
        public function update(Request $request, $id)
        {
            $filiere = Filiere::find($id);

            if (!$filiere) {
                return response()->json([
                    'message' => "La filière n'existe pas",
                    'status' => 404,
                ]);
            } else {
                $request->validate([
                    'nom_filiere' => 'required|string',
                ]);

                $filiere->nom_filiere = $request->nom_filiere;
                $filiere->save();

                return response()->json([
                    'message' => "Les informations de la filière ont été mises à jour avec succès",
                    'status' => 200,
                ], 200);
            }
        }

        /**
         * Supprime une filière.
         */
        public function destroy($id)
        {
            $filiere = Filiere::find($id);

            if (!$filiere) {
                return response()->json([
                    'message' => 'Cette filière n\'a pas été trouvée',
                    'status' => 404,
                ]);
            }

            $filiere->delete();

            return response()->json([
                'message' => "Filière supprimée avec succès",
                'status' => 200,
            ], 200);
        }
    }

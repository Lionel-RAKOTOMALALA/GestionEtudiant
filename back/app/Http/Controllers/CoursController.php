<?php

namespace App\Http\Controllers;

use App\Models\Cours;
use App\Models\Professeur;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;



class CoursController extends Controller
{
    /**
     * Affiche la liste des cours avec le nom de l'unité d'enseignement et du professeur.
     */
    public function index()
    {
        $user = Auth::user(); // Récupérer l'utilisateur authentifié
    

        $professeurCount = DB::table('professeurs')
        ->where('user_id', $user->id)
        ->count();
        $etudiant = DB::table('etudiants')
        ->where('id_user', $user->id)
        ->first();
    
        if ($professeurCount == 1) {
            $cours = Cours::join('unite_enseign', 'cours.id_unite', '=', 'unite_enseign.id_unite')
                ->join('professeurs', 'professeurs.id_prof', '=', 'cours.id_prof')
                ->join('users', 'users.id', '=', 'professeurs.user_id')
                ->select('cours.*', 'unite_enseign.nom_unite', 'users.name as nom_professeur')
                ->get();
        } else {
            $cours = Cours::join('unite_enseign', 'cours.id_unite', '=', 'unite_enseign.id_unite')
                ->join('professeurs', 'professeurs.id_prof', '=', 'cours.id_prof')
                ->join('users', 'users.id', '=', 'professeurs.user_id')
                ->select('cours.*', 'unite_enseign.nom_unite', 'users.name as nom_professeur')
                ->where('cours.niveau_cours', $etudiant->niveau)
                ->where('unite_enseign.id_filiere',$etudiant->id_filiere)
                ->get();
        }
    
        return response()->json([
            'cours' => $cours,
            'status' => 200
        ], 200);
    }

    public function updateCoursStatus(Request $request, $id)
    {
        $cours = Cours::find($id);

        if (!$cours) {
            return response()->json(['message' => 'Cours non trouvé.'], 404);
        }


        $cours->statut_cours = 'Vue';

        if ($cours->update()) {
            return response()->json(['message' => 'Statut du cours mis à jour avec succès', 'status' => 200], 200);
        } else {
            return response()->json(['message' => 'Erreur lors de la modification du statut du cours.'], 500);
        }
    }

    /**
     * Crée un nouveau cours.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'libelle' => 'required|string',
                'niveau_cours' => 'required|string',
                'image_cours' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'fichier_cours' => 'nullable|mimes:pdf,doc,docx|max:2048',
                'video_cours.*' => 'nullable|mimes:mp4,mov,avi|max:20480',
                'id_unite' => 'required|exists:unite_enseign,id_unite',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'error_list' => $validator->messages(),
                ], 400);
            }
    
            $user = Auth::user();
    
            // Vérifier si l'utilisateur est authentifié
            if (!$user) {
                return response()->json([
                    'message' => "L'utilisateur n'est pas authentifié",
                    'status' => 401
                ], 401);
            }
    
            // Utiliser l'id de l'utilisateur dans la requête
            $professeur = Professeur::where('user_id', $user->id)->first();
    
            if (!$professeur) {
                return response()->json([
                    'message' => "L'utilisateur n'est pas un professeur",
                    'status' => 401
                ], 401);
            }
    
            $imageFilename = null;
            $fileFilename = null;
            $videoFilenames = [];
    
            if ($request->hasFile('image_cours')) {
                $imageFile = $request->file('image_cours');
                $imageFilename = Str::random(32) . '.' . $imageFile->getClientOriginalExtension();
                $imageFile->move('uploads/cours/images', $imageFilename);
            }
    
            if ($request->hasFile('fichier_cours')) {
                $fileFile = $request->file('fichier_cours');
                $fileFilename = Str::random(32) . '.' . $fileFile->getClientOriginalExtension();
                $fileFile->move('uploads/cours/fichiers', $fileFilename);
            }
    
            if ($request->hasFile('video_cours')) {
                foreach ($request->file('video_cours') as $videoFile) {
                    $videoFilename = Str::random(32) . '.' . $videoFile->getClientOriginalExtension();
                    $videoFile->move('uploads/cours/videos', $videoFilename);
                    $videoFilenames[] = $videoFilename;
                }
            }
    
            // Create the course
            $course = Cours::create([
                'libelle' => $request->libelle,
                'niveau_cours' => $request->niveau_cours,
                'image_cours' => $imageFilename,
                'fichier_cours' => $fileFilename,
                'video_cours' => implode(',', $videoFilenames),
                'id_prof' => $professeur->id_prof,
                'id_unite' => $request->id_unite,
            ]);
    
            // Notify about the new course
            $notificationContent = 'L\'utilisateur ' . Auth::user()->name . ' vient de créer un nouveau cours';
    
           
            Notification::create([
                'code_matiere' => $course->code_matiere, 
                'title' => 'Nouveau cours',
                'content' => $notificationContent,
            ]);
    
            return response()->json([
                'message' => "Le cours a été créé avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a eu une erreur lors de l'insertion du cours",
                'status' => 500
            ], 500);
        }
    }
    

    

    /**
     * Affiche les détails d'un cours spécifique avec le nom de l'unité d'enseignement et du professeur.
     */
    public function show(int $id)
{
    $cours = Cours::join('unite_enseign', 'cours.id_unite', '=', 'unite_enseign.id_unite')
                ->join('professeurs', 'professeurs.id_prof', '=', 'cours.id_prof')
                ->join('users', 'users.id', '=', 'professeurs.user_id')
                ->where('cours.code_matiere', $id)
                ->select('cours.*', 'unite_enseign.nom_unite', 'users.name as nom_professeur')
                ->get();

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
                    'image_cours' => 'nullable',
                    'fichier_cours' => 'nullable',
                    'video_cours' => 'nullable',
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

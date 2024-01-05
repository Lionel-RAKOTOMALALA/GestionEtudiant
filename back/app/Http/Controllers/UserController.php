<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;


class UserController extends Controller
{
    /**
     * Affiche la liste des utilisateurs.
     */
    public function comboUserEtudiant() {
        $users = DB::table('users')
    ->leftJoin('etudiants', 'users.id', '=', 'etudiants.id_user')
    ->leftJoin('professeurs', 'users.id', '=', 'professeurs.user_id')
    ->whereNull('etudiants.id_user')
    ->whereNull('professeurs.user_id')
    ->select('users.*')
    ->get();

        

    
        return response()->json([
            'users' => $users,
            'status' => 200
        ], 200);
    }
    public function countProfesseurForAuthenticatedUser(Request $request)
{
    // L'utilisateur authentifié est automatiquement disponible dans la requête
    $user = $request->user();

    // Vérifiez si l'utilisateur est authentifié
    if ($user) {
        // Comptez le nombre de lignes dans la table "professeurs" pour l'utilisateur authentifié
        $professeurCount = DB::table('professeurs')
            ->where('user_id', $user->id)
            ->count();

        return response()->json(['professeur_count' => $professeurCount]);
    }

    return response()->json(['message' => 'Utilisateur non authentifié'], 401);
}

    public function comboUserProfesseurs() {
        $users = DB::table('users')
    ->whereNotIn('id', function ($query) {
        $query->select('id_user')
            ->from('etudiants');
    })
    ->get();

    
        return response()->json([
            'users' => $users,
            'status' => 200
        ], 200);
    }
    
    public function index()
    {
        $users = User::all();

        return response()->json([
            'users' => $users,
            'status' => 200
        ], 200);
    }

    /**
     * Crée un nouvel utilisateur.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|string',
            'role_user' => 'required|string',
            // Ajoutez d'autres règles de validation si nécessaire
        ]);

        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        return response()->json([
            'message' => "L'utilisateur a été créé avec succès",
            'status' => 200
        ], 200);
    }

    public function getUserData(){

        $user = Auth::user();

        $notification = DB::table('notifications')
        ->join('cours', 'notifications.id', '=', 'cours.code_matiere')
        ->join('professeurs', 'cours.id_prof', '=', 'professeurs.id_prof')
        ->select('*')
        ->get();
          return response()->json([
            'user' => $user,
            'notification' => $notification
        ], 200);

    }

    /**
     * Affiche les détails d'un utilisateur spécifique.
     */
    public function show(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Cet utilisateur n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        return response()->json([
            'user' => $user,
            'status' => 200,
        ]);
    }

    /**
     * Met à jour un utilisateur.
     */
    public function update(Request $request, int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => "L'utilisateur n'existe pas",
                'status' => 404,
            ]);
        }

        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'string',
            'role_user' => 'required|string',
            // Ajoutez d'autres règles de validation si nécessaire
        ]);

        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => "Les informations de l'utilisateur ont été mises à jour avec succès",
            'status' => 200,
        ], 200);
    }

    /**
     * Supprime un utilisateur.
     */
    public function destroy(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Cet utilisateur n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        $user->delete();

        return response()->json([
            'message' => "Utilisateur supprimé avec succès",
            'status' => 200,
        ], 200);
    }
}

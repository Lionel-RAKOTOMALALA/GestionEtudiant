<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Affiche la liste des utilisateurs.
     */
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

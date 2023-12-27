<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:191',
            'email' => 'required|email',
            'password' => 'required|min:8',
            'role_user' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_user' => $request->role_user,
        ]);

        $token = $user->createToken($user->email . '_Token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'name' => $user->name,
            'token' => $token,
            'message' => 'Utilisateur authentifié avec succès',
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:191',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }

        $user = User::where('name', $request->name)
            ->orWhere('email', $request->name)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => "Nom d'utilisateur ou adresse e-mail incorrect",
            ]);
        }

        $role = '';
        $token = '';

        if ($user->role_user == 1) {
            $token = $user->createToken($user->email . '_AdminToken', ['server:admin'])->plainTextToken;
            $role = 'admin';
        } else {
            $token = $user->createToken($user->email . '_Token', ['server:userSimple'])->plainTextToken;
            $role = 'userSimple';
        }

        // Comptez le nombre de lignes dans la table "professeurs" pour l'utilisateur authentifié
        $professeurCount = DB::table('professeurs')
            ->where('user_id', $user->id)
            ->count();

        return response()->json([
            'status' => 200,
            'role' => $role,
            'token' => $token,
            'professeur_count' => $professeurCount,
            'message' => "L'utilisateur a été authentifié avec succès",
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'message' => 'Données de l\'utilisateur récupérées',
            'data' => $request->user(),
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response([
            'message' => 'Déconnexion réussie',
            'status' => 200,
        ], 200);
    }
}

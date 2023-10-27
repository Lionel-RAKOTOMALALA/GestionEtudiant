<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EtudiantController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfesseurController;


Route::middleware('auth:sanctum')->group( function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/checkingAuthenticated', function(){
        return response()->json(['message'=>'Bienvenue','status'=>200],200);
    });
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


Route::resource('users', UserController::class);

// Routes pour les étudiants (etudiants)
Route::resource('etudiants', EtudiantController::class);

// Routes pour les filières (filieres)
Route::resource('filieres', FiliereController::class);

// Routes pour les unités d'enseignement (uniteEnseigns)
Route::resource('uniteEnseigns', UniteEnseignController::class);

// Routes pour les cours (cours)
Route::resource('cours', CoursController::class);

// Routes pour les professeurs (professeurs)
Route::resource('professeurs', ProfesseurController::class);
Route::get('nom_etudiant', [UserController::class, 'comboUserEtudiant']);
Route::get('nom_prof', [UserController::class, 'comboUserProfesseurs']);

<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EtudiantController;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfesseurController;
use App\Http\Controllers\UploadController;


Route::middleware('auth:sanctum', 'isAPIAdmin')->group( function () {
Route::get('countProfesseurForAuthenticatedUser',[UserController::class,'countProfesseurForAuthenticatedUser']);

    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/checkingAuthenticated', function(){
        return response()->json(['message'=>'Bienvenue','status'=>200],200);
    });
});
Route::middleware('auth:sanctum')->group(function () {
    
Route::resource('cours', CoursController::class);
    Route::post('logout', [AuthController::class, 'logout']);
Route::get('countProfesseurForAuthenticatedUser',[UserController::class,'countProfesseurForAuthenticatedUser']);
    Route::get('/checkingAuthenticatedUserSimple', function(){
        return response()->json([
            'message' => 'Bienvenue',
            'status' => 200
        ], 200);
    });
     

 

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


// Routes pour les professeurs (professeurs)
Route::resource('professeurs', ProfesseurController::class);
Route::get('nom_etudiant', [UserController::class, 'comboUserEtudiant']);
Route::get('nom_prof', [UserController::class, 'comboUserProfesseurs']);

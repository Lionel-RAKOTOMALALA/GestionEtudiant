<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('etudiants', function (Blueprint $table) {
            $table->increments('num_inscription'); // Clé primaire auto-incrémentée
            $table->string('niveau');
            $table->string('parcours');
            $table->unsignedBigInteger('id_user'); // Mettez à jour pour utiliser 'user_id' comme clé étrangère
            $table->unsignedBigInteger('id_filiere'); // Ajout de la colonne id_filiere
            $table->foreign('id_filiere')->references('id_filiere')->on('filieres');
            // Déclarez la contrainte de clé étrangère pour 'user_id'
            $table->timestamps(); // Ajoute automatiquement les colonnes 'created_at' et 'updated_at'
            $table->foreign('id_user')->references('id')->on('users');
        });
    }
    
    


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

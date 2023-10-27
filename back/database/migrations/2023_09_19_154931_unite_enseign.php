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
        Schema::create('unite_enseign', function (Blueprint $table) {
            $table->increments('id_unite'); 
            $table->string('nom_unite');
            $table->unsignedInteger('id_filiere')->nullable(); // Ajout de la colonne id_filiere
            $table->timestamps(); // Ajoute automatiquement les colonnes 'created_at' et 'updated_at'
            $table->foreign('id_filiere')->references('id_filiere')->on('filieres');
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
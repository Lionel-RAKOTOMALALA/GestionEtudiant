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
        Schema::create('professeurs', function (Blueprint $table) {
            $table->increments('id_prof'); // Clé primaire auto-incrémentée
            $table->string('matiere_enseign');
            $table->unsignedBigInteger('user_id'); // Mettez à jour pour utiliser 'user_id' comme clé étrangère
            $table->foreign('user_id')->references('id')->on('users');
            $table->timestamps(); // Ajoute automatiquement les colonnes 'created_at' et 'updated_at'
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

<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('cours', function (Blueprint $table) {
            $table->increments('code_matiere'); // Clé primaire auto-incrémentée
            $table->string('libelle');
            $table->string('image_cours')->nullable(); // Colonne pour les images (peut être NULL)
            $table->string('fichier_cours')->nullable(); // Colonne pour les fichiers (peut être NULL)
            $table->string('video_cours')->nullable(); // Colonne pour les vidéos (peut être NULL)
            $table->unsignedBigInteger('id_prof'); // Clé étrangère pour le professeur
            $table->unsignedBigInteger('id_unite'); // Clé étrangère pour l'unité d'enseignement
            $table->foreign('id_prof')->references('id_prof')->on('professeurs');
            $table->foreign('id_unite')->references('id_unite')->on('unite_enseign');
            $table->timestamps(); // Ajoute automatiquement les colonnes 'created_at' et 'updated_at'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('cours');
    }
};

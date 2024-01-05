<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('code_matiere');
            $table->string('title');
            $table->text('content');
            $table->tinyInteger('status_notif')->default(0);
            $table->foreign('code_matiere')->references('code_matiere')->on('cours')->onDelete('cascade');
            $table->timestamps();

            // Ajoutez d'autres colonnes en fonction de vos besoins
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cours extends Model
{
    use HasFactory;

    protected $table = 'cours';

    protected $primaryKey = 'code_matiere';

    protected $fillable = [
        'libelle',
        'image_cours',
        'fichier_cours',
        'video_cours',
        'id_prof',
        'id_unite',
    ];


}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;

    protected $table = 'etudiants';

    protected $primaryKey = 'num_inscription';

    protected $fillable = [
        'niveau',
        'parcours',
        'id_filiere', // Modifier le nom de la clé étrangère correspondant à 'id_filiere' du modèle Filiere
        'id_user', // Modifier le nom de la clé étrangère correspondant à 'id' du modèle User
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'id_filiere');
    }
}

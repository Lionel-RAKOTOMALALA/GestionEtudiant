<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UniteEnseign extends Model
{
    use HasFactory;

    protected $table = 'unite_enseign';

    protected $primaryKey = 'id_unite';

    protected $fillable = [
        'nom_unite',
        'id_filiere',
    ];

  
}

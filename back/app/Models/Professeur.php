<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Professeur extends Model
{
    use HasFactory;

    protected $table = 'professeurs'; // Nom de la table

    protected $primaryKey = 'id_prof'; // Clé primaire

    protected $fillable = [
        'matiere_enseign',
        'user_id',
    ];

    // Définissez la relation de clé étrangère avec la table 'users'
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}

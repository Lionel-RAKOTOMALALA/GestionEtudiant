<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'notifications';

    protected $fillable = [
        'code_matiere',
        'title',
        'content',
        'status_notif'
    ];

    public function cours()
    {
        return $this->belongsTo(Cours::class, 'code_matiere', 'code_matiere');
    }
}

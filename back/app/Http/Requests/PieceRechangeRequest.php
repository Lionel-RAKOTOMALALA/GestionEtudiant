<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PieceRechangeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nom_piece' => 'required|string|max:255',
            'description_piece' => 'nullable|string',
            'stock_dispo' => 'required|numeric',
            'cout_unitaire' => 'required|numeric',
            'disponibilite' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'nom_piece.required' => 'Le nom de la pièce est requis.',
            'stock_dispo.required' => 'Le stock disponible est requis.',
            // Vous pouvez ajouter des messages personnalisés pour d'autres règles ici.
        ];
    }
}

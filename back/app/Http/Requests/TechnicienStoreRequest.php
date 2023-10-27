<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TechnicienStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'competence' => 'required|string',
            // 'id_user' => 'required|exists:users,id',
            // // 'nom_utilisateur' => 'required|exists:users,name',
        ];
    }

    public function messages()
    {
        return [
            'competence' => 'Veuillez entrer la compétence du technicien',
            'id_user.required' => 'Veuillez sélectionner un utilisateur',
            'id_user.exists' => 'L\'utilisateur sélectionné n\'existe pas',
        ];
    }
}

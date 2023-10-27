<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DemandeurStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Vous pouvez définir des autorisations personnalisées ici si nécessaire.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            // 'id_user' => 'required|exists:users,id',
            // 'urgence' => 'required|string|max:255',
            // 'priorite' => 'required|string|max:255',
            // 'description_probleme' => 'nullable|string',
            // 'statut_actuel' => 'nullable|string',
            // 'date_resolution' => 'nullable|date',
            // 'cout_reparation' => 'required|numeric',
            // 'nom_entreprise' => 'required|string|max:255',
            // 'type_materiel' => 'required|string|max:255',
            // 'nom_utilisateur' => 'required|string|max:255',
            // 'intervention_faite' => 'nullable|string',
            // 'suite_a_donnee' => 'nullable|string',
            // 'num_serie' => 'required|exists:materiels,num_serie',
            // 'id_demandeur' => 'required|exists:demandeurs,id_demandeur',
            // 'id_technicien' => 'required|exists:techniciens,id_technicien',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'id_user.required' => 'Veuillez sélectionner un utilisateur.',
            'id_user.exists' => "L'utilisateur sélectionné n'existe pas.",
            // Ajoutez d'autres messages d'erreur au besoin



           
        ];
    }
}

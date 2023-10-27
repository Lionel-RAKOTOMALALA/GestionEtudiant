
<?php

use Illuminate\Foundation\Http\FormRequest;

class newReq extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'urgence' => 'required|string|max:255',
            'priorite' => 'required|string|max:255',
            'description_probleme' => 'nullable|string',
            'statut_actuel' => 'nullable|string',
            'date_resolution' => 'nullable|date',
            'cout_reparation' => 'required|numeric',
            'nom_entreprise' => 'required|string|max:255',
            'type_materiel' => 'required|string|max:255',
            'nom_utilisateur' => 'required|string|max:255',
            'intervention_faite' => 'nullable|string',
            'suite_a_donnee' => 'nullable|string',
            'num_serie' => 'required|exists:materiels,num_serie',
            'id_technicien' => 'required|exists:techniciens,id_technicien',
        ];
    }
}
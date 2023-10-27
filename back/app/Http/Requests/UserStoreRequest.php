<?php


namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à effectuer cette demande.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Récupère les règles de validation qui s'appliquent à la demande.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->isMethod('post')) {
            return [
                'username' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|string|min:8',
                'role_user' => 'required|string',
                'id_entreprise' => 'required|integer',
                'logo' => 'nullable|string', // Ajout de la validation pour le logo
            ];
        } elseif ($this->isMethod('put')) {
            return [
                'username' => 'required|string',
                'email' => 'required|string|email',
                'password' => 'required|string|min:8',
                'role_user' => 'required|string',
                'id_entreprise' => 'required|integer',
                'logo' => 'nullable|string', // Ajout de la validation pour le logo
            ];
        }
    }

    /**
     * Obtenez les messages d'erreur personnalisés pour les règles de validation.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        if ($this->isMethod('post')) {
            return [
                'username.required' => 'Veuillez entrer le nom d\'utilisateur',
                'email.required' => 'Veuillez entrer l\'adresse e-mail',
                'email.email' => 'L\'adresse e-mail doit être une adresse e-mail valide',
                'email.unique' => 'Cette adresse e-mail est déjà utilisée par un autre utilisateur',
                'password.required' => 'Veuillez entrer un mot de passe',
                'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
                'role_user.required' => 'Veuillez entrer le rôle de l\'utilisateur',
                'id_entreprise.required' => 'Veuillez sélectionner une entreprise',
                'logo.string' => 'Le logo doit être une chaîne de caractères',
            ];
        } elseif ($this->isMethod('put')) {
            return [
                'username.required' => 'Veuillez entrer le nom d\'utilisateur',
                'email.required' => 'Veuillez entrer l\'adresse e-mail',
                'email.email' => 'L\'adresse e-mail doit être une adresse e-mail valide',
                'password.required' => 'Veuillez entrer un mot de passe',
                'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
                'role_user.required' => 'Veuillez entrer le rôle de l\'utilisateur',
                'id_entreprise.required' => 'Veuillez sélectionner une entreprise',
                'logo.string' => 'Le logo doit être une chaîne de caractères',
            ];
        }
    }
}

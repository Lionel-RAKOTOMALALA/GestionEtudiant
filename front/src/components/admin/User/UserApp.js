import React from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import UserList from "./UserList"; // Vous devrez créer le composant UserList pour afficher la liste des utilisateurs.

const UserApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Utilisateurs</h1>
      <p className="mb-5">
        Gérez les utilisateurs de votre équipe ici.
      </p>
      <NavLink to="/admin/users/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter un utilisateur
          </button>
        </div>
      </NavLink>
      <UserList /> {/* Utilisez le composant UserList pour afficher la liste des utilisateurs ici. */}
    </div>
  );
};

export default UserApp;

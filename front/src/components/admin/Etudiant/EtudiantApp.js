import React from "react";
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import EtudiantList from "./EtudiantList"; // Assurez-vous d'importer le composant approprié pour la liste des étudiants

const EtudiantApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Gestion des Étudiants</h1>
      <p className="mb-5">
        Gérez les étudiants de votre établissement ici.
      </p>
      <NavLink to="/admin/etudiants/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter un nouvel étudiant
          </button>
        </div>
      </NavLink>
      <EtudiantList /> {/* Utilisez le composant approprié pour la liste des étudiants */}
    </div>
  );
};

export default EtudiantApp;

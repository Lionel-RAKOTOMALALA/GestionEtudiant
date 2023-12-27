import React from "react";
import { UilPlus } from "@iconscout/react-unicons";
import { NavLink } from "react-router-dom";
import UniteEnseignList from "./UniteEnseignList"; // Assurez-vous d'importer le composant approprié pour la liste des unités d'enseignement

const UniteEnseignApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Gestion des Unités d'Enseignement</h1>
      <p className="mb-5">
        Gérez les unités d'enseignement de votre établissement ici.
      </p>
      <NavLink to="/user/uniteEnseign/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter une nouvelle unité d'enseignement
          </button>
        </div>
      </NavLink>
      <UniteEnseignList /> {/* Utilisez le composant approprié pour la liste des unités d'enseignement */}
    </div>
  );
};

export default UniteEnseignApp;

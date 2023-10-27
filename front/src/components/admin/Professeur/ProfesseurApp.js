import React from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import ProfesseurList from "./ProfesseurList"; // Assurez-vous d'importer le composant ProfesseurList

const ProfesseurApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Professeurs</h1>
      <p className="mb-5">
        Gérez les professeurs de votre équipe ici.
      </p>
      <NavLink to="/admin/professeurs/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter un professeur
          </button>
        </div>
      </NavLink>
      <ProfesseurList />
    </div>
  );
};

export default ProfesseurApp;

import React from "react";
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import FiliereList from "./FiliereList"; // Assurez-vous de créer le composant FiliereList pour afficher la liste des filières.

const FiliereApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Filieres</h1>
      <p className="mb-5">
        Gérez les filières de votre établissement ici.
      </p>
      <NavLink to="/admin/filieres/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter une filière
          </button>
        </div>
      </NavLink>
      <FiliereList />
    </div>
  );
};

export default FiliereApp;

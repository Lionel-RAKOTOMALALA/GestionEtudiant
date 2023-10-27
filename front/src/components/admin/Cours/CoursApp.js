import React from "react";
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import CoursList from "./CoursList"; 

const CoursApp = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Gestion des Cours</h1>
      <p className="mb-5">
        Gérez les cours de votre établissement ici.
      </p>
      <NavLink to="/admin/cours/ajout">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter un nouveau cours
          </button>
        </div>
      </NavLink>
      <CoursList />
    </div>
  );
};

export default CoursApp;

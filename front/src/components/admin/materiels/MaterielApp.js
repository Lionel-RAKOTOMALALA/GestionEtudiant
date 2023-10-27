import React from 'react';
import 'datatables.net-dt';
import { UilPlus } from '@iconscout/react-unicons';
import { NavLink } from 'react-router-dom';
import MaterielList from './MaterielList';

const Materiel = () => {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Materiels</h1>
      <p className="mb-5">
        Ne laissez pas votre appareil endommagé affecter votre quotidien. Notre équipe dévouée est là pour vous aider.
        <br />
        Faites dès maintenant une demande d'intervention pour réparer votre appareil et reprenez le contrôle de votre technologie.
      </p>
      <NavLink to="/admin/materiels/demande_reparation">
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-primary mb-3">
            <UilPlus size="20" /> Ajouter
          </button>
        </div>
      </NavLink>
      <MaterielList />
    </div>
  );
};

export default Materiel;

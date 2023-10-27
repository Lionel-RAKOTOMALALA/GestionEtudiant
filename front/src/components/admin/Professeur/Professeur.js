import React from "react";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const Professeur = ({ professeur, refreshData }) => {
  const navigate = useNavigate();

  if (!professeur) {
    return null;
  }

  const deleteProfesseur = (e, id) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer ce professeur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/professeurs/${id}`) // Assurez-vous d'utiliser la route appropriée pour les professeurs
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData(); // Appelez la fonction pour actualiser les données
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/professeurs'); // Redirigez vers la page appropriée
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  }

  return (
    <tr>
      <td>{professeur.id_prof}</td>
      <td>{professeur.matiere_enseign}</td>
      <td>{professeur.nom_professeur}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/professeur/edit/${professeur.id_prof}`}>
            <button className="btn btn-primary btn-sm mr-2">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ display: 'inline-block' }}>
          <button onClick={(e) => deleteProfesseur(e, professeur.id_prof)} className="btn btn-danger btn-sm">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Professeur;

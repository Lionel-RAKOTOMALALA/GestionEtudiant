import React from "react";
import { UilEditAlt, UilTrashAlt, UilEye, UilCheckCircle } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const Etudiant = ({ etudiant, refreshData }) => {
  const navigate = useNavigate();  // Appelez useNavigate en dehors de toute condition

  if (!etudiant) {
    return null;
  }

  const deleteEtudiant = (e, numInscription) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer l'étudiant avec le numéro d'inscription ${numInscription} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/etudiants/${numInscription}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/etudiants'); 
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
      <td>{etudiant.num_inscription}</td>
      <td>{etudiant.niveau}</td>
      <td>{etudiant.parcours}</td>
      <td>{etudiant.nom_filiere}</td>
      <td>{etudiant.nom_utilisateur}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/etudiant/edit/${etudiant.num_inscription}`}>
            <button className="btn btn-primary btn-sm equal-width-button">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <button onClick={(e) => deleteEtudiant(e, etudiant.num_inscription)} className="btn btn-danger btn-sm equal-width-button">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/etudiants/${etudiant.num_inscription}`}>
            <button className="btn btn-primary btn-sm equal-width-button">
              <UilEye /> View
            </button>
          </NavLink>
        </div>
        <div style={{ display: 'inline-block' }}>
          <button className="btn btn-success btn-sm equal-width-button">
            <UilCheckCircle /> Valider
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Etudiant;

import React from "react";
import { UilEditAlt, UilTrashAlt, UilEye, UilCheckCircle } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const Cours = ({ cours, refreshData }) => {
  const navigate = useNavigate();  // Appelez useNavigate en dehors de toute condition

  if (!cours) {
    return null;
  }

  const deleteCours = (e, codeMatiere) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: `Êtes-vous sûr de vouloir supprimer le cours avec le code matière ${codeMatiere} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/cours/${codeMatiere}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Success', res.data.message, 'success');
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/admin/cours'); 
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
      <td>{cours.code_matiere}</td>
      <td>{cours.libelle}</td>
      <td>{cours.image_cours}</td>
      <td>{cours.fichier_cours}</td>
      <td>{cours.video_cours}</td>
      <td>{cours.nom_professeur}</td>
      <td>{cours.nom_unite}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/cours/edit/${cours.code_matiere}`}>
            <button className="btn btn-primary btn-sm equal-width-button">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <button onClick={(e) => deleteCours(e, cours.code_matiere)} className="btn btn-danger btn-sm equal-width-button">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/admin/cours/${cours.code_matiere}`}>
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

export default Cours;

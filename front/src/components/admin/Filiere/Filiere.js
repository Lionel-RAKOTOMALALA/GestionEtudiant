import React from "react";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const Filiere = ({ filiere, refreshData }) => {
  const navigate = useNavigate();

  if (!filiere) {
    return null;
  }

  const deleteFiliere = (e, id) => {
    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cette filière ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://127.0.0.1:8000/api/filieres/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire('Succès', res.data.message, 'success');
              refreshData(); 
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate('/user/filieres');
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
      <td>{filiere.id_filiere}</td>
      <td>{filiere.nom_filiere}</td>
      <td>
        <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
          <NavLink to={`/user/filieres/edit/${filiere.id_filiere}`}>
            <button className="btn btn-primary btn-sm mr-2">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ display: 'inline-block' }}>
          <button onClick={(e) => deleteFiliere(e, filiere.id_filiere)} className="btn btn-danger btn-sm">
            <UilTrashAlt /> Supprimer
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Filiere;

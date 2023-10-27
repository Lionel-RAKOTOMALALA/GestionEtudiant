import React from "react";
import { UilEditAlt, UilTrashAlt, UilEye, UilCheckCircle } from "@iconscout/react-unicons";
import axios from "axios";
import Swal from "sweetalert2";
import { NavLink, useNavigate } from "react-router-dom";

const UniteEnseign = ({ uniteEnseign, refreshData }) => {
  const navigate = useNavigate();

  if (!uniteEnseign) {
    return null;
  }

  const deleteUniteEnseign = (e, idUnite) => {
    Swal.fire({
      title: "Confirmer la suppression",
      text: `Êtes-vous sûr de vouloir supprimer l'unité d'enseignement avec l'ID ${idUnite} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/uniteEnseigns/${idUnite}`)
          .then((res) => {
            if (res.data.status === 200) {
              Swal.fire("Success", res.data.message, "success");
              refreshData();
            } else if (res.data.status === 404) {
              Swal.fire("Erreur", res.data.message, "error");
              navigate("/admin/uniteEnseigns");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  return (
    <tr>
      <td>{uniteEnseign.id_unite}</td>
      <td>{uniteEnseign.nom_unite}</td>
      <td>{uniteEnseign.id_filiere}</td>
      <td>
        <div style={{ marginRight: "1.2rem", display: "inline-block" }}>
          <NavLink to={`/admin/uniteEnseign/edit/${uniteEnseign.id_unite}`}>
            <button className="btn btn-primary btn-sm equal-width-button">
              <UilEditAlt /> Modifier
            </button>
          </NavLink>
        </div>
        <div style={{ marginRight: "1.2rem", display: "inline-block" }}>
          <button
            onClick={(e) => deleteUniteEnseign(e, uniteEnseign.id_unite)}
            className="btn btn-danger btn-sm equal-width-button"
          >
            <UilTrashAlt /> Supprimer
          </button>
        </div>
        <div style={{ marginRight: "1.2rem", display: "inline-block" }}>
          <NavLink to={`/admin/uniteEnseigns/${uniteEnseign.id_unite}`}>
            <button className="btn btn-primary btn-sm equal-width-button">
              <UilEye /> Voir
            </button>
          </NavLink>
        </div>
        <div style={{ display: "inline-block" }}>
          <button className="btn btn-success btn-sm equal-width-button">
            <UilCheckCircle /> Valider
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UniteEnseign;

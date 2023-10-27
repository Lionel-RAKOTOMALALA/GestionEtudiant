import React from "react";
import { UilEditAlt, UilTrashAlt } from "@iconscout/react-unicons";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";
import Swal from "sweetalert2";

const Materiel = ({ materiel, refreshData }) => {
    const navigate = useNavigate();

    if (!materiel) {
        return null;
    }

    const deleteMateriel = (e, id) => {
        Swal.fire({
          title: 'Confirmer la suppression',
          text: 'Êtes-vous sûr de vouloir supprimer ce matériel ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non',
        }).then((result) => {
          if (result.isConfirmed) {
            // L'utilisateur a cliqué sur "Oui", procédez à la suppression
            axios.delete(`http://127.0.0.1:8000/api/materiels/${id}`)
              .then((res) => {
                if (res.data.status === 200) {
                  swal('Success', res.data.message, 'success');
                  // Après la suppression réussie, actualisez les données
                  refreshData();
                } else if (res.data.status === 404) {
                  swal("Erreur", res.data.message, "error");
                  navigate('/admin/materiels');
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
            <td>{materiel.type_materiel}</td>
            <td>{materiel.num_serie}</td>
            <td>{materiel.etat_materiel}</td>
            <td>{materiel.nom_demandeur}</td>
            <td>{materiel.image_materiel_url}</td>
            <td>
                <div style={{ marginRight: '1.2rem', display: 'inline-block' }}>
                    <NavLink to={`/admin/materiels/${materiel.num_serie}`}>
                        <button className="btn btn-primary btn-sm mr-2">
                            <UilEditAlt /> Modifier
                        </button>
                    </NavLink>
                </div>
                <div style={{ display: 'inline-block' }}>
                    <button onClick={(e) => deleteMateriel(e, materiel.num_serie)} className="btn btn-danger btn-sm">
                        <UilTrashAlt /> Supprimer
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default Materiel;

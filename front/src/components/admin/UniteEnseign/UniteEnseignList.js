import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import UniteEnseign from "./UniteEnseign"; // Assurez-vous d'importer le composant approprié pour les unités d'enseignement
import $ from "jquery";
import Swal from "sweetalert2";
import Loader from "../materiels/loader";

const UniteEnseignList = () => {
  const [uniteEnseigns, setUniteEnseigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
  };

  const refreshData = () => {
    destroyDataTable();
    axios.get("http://127.0.0.1:8000/api/uniteEnseigns") // Assurez-vous d'utiliser l'URL correcte
      .then((response) => {
        setUniteEnseigns(response.data.unites); // Assurez-vous que la réponse contient les données des unités d'enseignement
        setIsLoading(false);
        if (tableRef.current) {
          $(tableRef.current).DataTable({
            language: {
              search: 'Rechercher :',
              lengthMenu: 'Afficher _MENU_ éléments par page',
              info: 'Affichage de _START_ à _END_ sur _TOTAL_ éléments',
              infoEmpty: 'Aucun élément trouvé',
              infoFiltered: '(filtré de _MAX_ éléments au total)',
              paginate: {
                first: 'Premier',
                previous: 'Précédent',
                next: 'Suivant',
                last: 'Dernier'
              }
            }
          });
        }
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des unités d'enseignement</h6>
        </div>
        <div className="card-body">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="table-responsive">
              <table
                ref={tableRef}
                className="table table-bordered table-striped"
                width="100%"
                cellSpacing="0"
              >
                <thead>
                  <tr>
                    <th>ID Unité</th>
                    <th>Nom de l'Unité</th>
                    <th>ID de la Filière</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {uniteEnseigns.map((uniteEnseign) => (
                    <UniteEnseign key={uniteEnseign.id_unite} uniteEnseign={uniteEnseign} refreshData={refreshData} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniteEnseignList;

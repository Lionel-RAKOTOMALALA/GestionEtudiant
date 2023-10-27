import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Filiere from "./Filiere"; 
import $ from "jquery";
import Swal from "sweetalert2";
import Loader from "../materiels/loader";

const FiliereList = () => {
  const [filieres, setFilieres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);

  const destroyDataTable = () => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }
  };

  const refreshData = () => {
    destroyDataTable();
    axios.get("http://127.0.0.1:8000/api/filieres")
      .then((response) => {
        setFilieres(response.data.filieres); // Assurez-vous que les données renvoyées correspondent à votre modèle Filiere.
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
          <h6 className="m-0 font-weight-bold text-primary">Liste des filières</h6>
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
                    <th>ID Filière</th>
                    <th>Nom de la filière</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filieres.map((filiere) => (
                    <Filiere key={filiere.id_filiere} filiere={filiere} refreshData={refreshData} />
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

export default FiliereList;

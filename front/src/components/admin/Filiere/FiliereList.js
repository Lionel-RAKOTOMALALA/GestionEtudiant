import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Button, Space, Spin } from "antd";
import Swal from "sweetalert2";
import Loader from "../materiels/loader";
import { NavLink, useNavigate } from "react-router-dom";

const FiliereList = () => {
  const [filieres, setFilieres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const destroyDataTable = () => {
    if (tableRef.current) {
      tableRef.current = null;
    }
  };

  const refreshData = () => {
    destroyDataTable();
    axios.get("http://127.0.0.1:8000/api/filieres")
      .then((response) => {
        setFilieres(response.data.filieres);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const columns = [
    {
      title: "ID Filière",
      dataIndex: "id_filiere",
      key: "id_filiere",
    },
    {
      title: "Nom de la filière",
      dataIndex: "nom_filiere",
      key: "nom_filiere",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/user/filieres/edit/${record.id_filiere}`)}>
            Modifier
          </Button>
          <Button type="danger" onClick={() => deleteFiliere(record.id_filiere)}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  const deleteFiliere = (id) => {
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
  };

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des filières</h6>
        </div>
        <div className="card-body">
          {isLoading ? (
            <Spin size="large" />
          ) : (
            <Table columns={columns} dataSource={filieres} />
          )}
        </div>
      </div>
    </div>
  );
};

export default FiliereList;

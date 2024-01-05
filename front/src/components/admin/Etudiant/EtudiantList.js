import React, { useEffect, useState } from "react";
import { Table, Button, Space, Spin } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import { UilEditAlt, UilTrashAlt, UilEye, UilCheckCircle } from "@iconscout/react-unicons";
import { useNavigate } from "react-router-dom";

const EtudiantList = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
    {
      title: "Numéro d'Inscription",
      dataIndex: "num_inscription",
      key: "num_inscription",
    },
    {
      title: "Niveau",
      dataIndex: "niveau",
      key: "niveau",
    },
    {
      title: "Parcours",
      dataIndex: "parcours",
      key: "parcours",
    },
    {
      title: "Nom de la Filière",
      dataIndex: "nom_filiere",
      key: "nom_filiere",
    },
    {
      title: "Nom de l'Etudiant",
      dataIndex: "nom_utilisateur",
      key: "nom_utilisateur",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/admin/etudiant/edit/${record.num_inscription}`)}>
            <UilEditAlt /> Modifier
          </Button>
          <Button type="danger" onClick={() => deleteEtudiant(record.num_inscription)}>
            <UilTrashAlt /> Supprimer
          </Button>
          <Button type="primary" onClick={() => navigate(`/admin/etudiants/${record.num_inscription}`)}>
            <UilEye /> View
          </Button>
         
        </Space>
      ),
    },
  ];

  const deleteEtudiant = (numInscription) => {
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
  };

  const refreshData = () => {
    axios.get("http://127.0.0.1:8000/api/etudiants")
      .then((response) => {
        setEtudiants(response.data.etudiants);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des étudiants</h6>
        </div>
        <div className="card-body">
          {isLoading ? (
            <Spin size="large" />
          ) : (
            <Table columns={columns} dataSource={etudiants} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EtudiantList;

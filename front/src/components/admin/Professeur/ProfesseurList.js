import React, { useEffect, useState, useRef } from "react";
import { Table, Button, Space, Spin, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

const ProfesseurList = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const destroyDataTable = () => {
    if (tableRef.current) {
      tableRef.current = null;
    }
  };

  const refreshData = async () => {
    destroyDataTable();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/professeurs");
      const data = await response.json();

      if (response.ok) {
        setProfesseurs(data.professeurs);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const columns = [
    {
      title: "ID Professeur",
      dataIndex: "id_prof",
      key: "id_prof",
    },
    {
      title: "Matière enseignée",
      dataIndex: "matiere_enseign",
      key: "matiere_enseign",
    },
    {
      title: "Nom de l'utilisateur",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => navigate(`/admin/professeur/edit/${record.id_prof}`)}>
            Modifier
          </Button>
          <Button type="danger" onClick={() => showDeleteConfirm(record.id_prof)}>
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  const showDeleteConfirm = (id) => {
    confirm({
      title: 'Confirmer la suppression',
      icon: <ExclamationCircleOutlined />,
      content: 'Êtes-vous sûr de vouloir supprimer ce professeur ?',
      okText: 'Oui',
      okType: 'danger',
      cancelText: 'Non',
      onOk() {
        deleteProfesseur(id);
      },
      onCancel() {
        console.log('Annulation');
      },
    });
  };

  const deleteProfesseur = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/professeurs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();

        if (data.status === 200) {
          Modal.success({
            title: 'Success',
            content: data.message,
            onOk: refreshData,
          });
        } else if (data.status === 404) {
          Modal.error({
            title: 'Erreur',
            content: data.message,
            onOk: () => navigate('/admin/professeurs'),
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Liste des professeurs</h6>
        </div>
        <div className="card-body">
          {isLoading ? (
            <Spin size="large" />
          ) : (
            <Table columns={columns} dataSource={professeurs} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfesseurList;

// CoursList.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Row, Table } from "antd";
import Loader from "../materiels/loader";

const { Meta } = Card;

const YourCustomCardComponent = ({ cours }) => (
  <Link to={`/user/detail_cours/${cours.code_matiere}`} style={{ textDecoration: 'none', color: 'inherit' }}>
    <Card
      hoverable
      style={{
        borderRadius: 10,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s",
      }}
      cover={
        <img
          alt={cours.libelle}
          src={`http://localhost:8000/uploads/cours/images/${cours.image_cours}`}
          style={{
            objectFit: "cover",
            borderRadius: "10px 10px 0 0",
            height: "150px",
            width: "100%",
          }}
        />
      }
      actions={[
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <Meta
        avatar={<Avatar src={`http://localhost:8000/uploads/cours/images/${cours.image_cours}`} />}
        title={<span style={{ fontSize: 18, textDecoration: 'none', color: 'inherit' }}>{cours.libelle}</span>}
        description={
          <div style={{ height: "50%", overflow: "hidden" }}>
            <p style={{ marginBottom: 5, fontSize: 14, textDecoration: 'none', color: 'inherit' }}>Professeur: {cours.nom_professeur}</p>
            <p style={{ marginBottom: 0, fontSize: 14, textDecoration: 'none', color: 'inherit' }}>Unité d'Enseignement: {cours.nom_unite}</p>
          </div>
        }
      />
    </Card>
  </Link>
);

const CoursList = () => {
  const [cours, setCours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    axios
      .get("http://127.0.0.1:8000/api/cours", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((response) => {
        setCours(response.data.cours);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de requête:", error);
        if (error.response && error.response.status === 401) {
          // Gérer les erreurs liées à l'autorisation ici
        }
      });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  const columns = [
    {
      title: "Code Matière",
      dataIndex: "code_matiere",
      key: "code_matiere",
    },
    {
      title: "Libellé",
      dataIndex: "libelle",
      key: "libelle",
    },
    {
      title: "Image du Cours",
      dataIndex: "image_cours",
      key: "image_cours",
      render: (text, record) => (
        <img
          alt={record.libelle}
          src={`http://localhost:8000/uploads/cours/images/${text}`}
          style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
      ),
    },
    {
      title: "Nom du Professeur",
      dataIndex: "nom_professeur",
      key: "nom_professeur",
    },
    {
      title: "Nom de l'Unité d'Enseignement",
      dataIndex: "nom_unite",
      key: "nom_unite",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <SettingOutlined key="setting" />
          <EditOutlined key="edit" />
          <EllipsisOutlined key="ellipsis" />
        </>
      ),
    },
  ];

  return (
    <div>
      {localStorage.getItem("professeur_count") === "1" ? (
        <Card title="Liste des cours" className="mb-4">
          {isLoading ? (
            <Loader />
          ) : (
            <Table
              dataSource={cours}
              columns={columns}
              rowKey={(record) => record.code_matiere}
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "30"],
                defaultPageSize: 10,
                showTotal: (total) => `Total ${total} éléments`,
              }}
            />
          )}
        </Card>
      ) : (
        <Row gutter={[16, 16]} justify="space-around">
          {cours.map((cours) => (
            <Col key={cours.code_matiere} xs={24} sm={12} md={8} lg={6} xl={4}>
              <YourCustomCardComponent cours={cours} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default CoursList;

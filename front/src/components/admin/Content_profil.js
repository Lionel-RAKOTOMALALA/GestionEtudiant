import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Avatar, Typography, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Title, Text } = Typography;

const Profile = ({ user }) => {
  const getRoleText = () => {
    if (user.role_user === 0) {
      return 'Utilisateur Simple';
    } else {
      return 'Administrateur';
    }
  };

  const getUserTypeText = () => {
    if (localStorage.getItem('professeur_count') === '0') {
      return 'Étudiant';
    } else {
      return 'Professeur';
    }
  };

  return (
    <Card
      style={{ width: 300, margin: 'auto', marginTop: 20 }}
      cover={
        <img
          alt="Photo de profil"
          src={`http://localhost:8000/uploads/users/${user.photo_profil}`}
          style={{ height: 200, objectFit: 'cover' }}
        />
      }
    >
      <Meta
        avatar={<Avatar icon={<UserOutlined />} size={64} />}
        title={<Title level={4}>{user.name}</Title>}
        description={
          <>
            <Text>{user.email}</Text>
            <br />
            <Text strong>{getRoleText()}</Text>
            <br />
            <Text type="secondary">{getUserTypeText()}</Text>
          </>
        }
      />
    </Card>
  );
};

const Content_profil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérez le token d'autorisation depuis votre système d'authentification
    const authToken = localStorage.getItem('auth_token');

    // Définissez l'en-tête d'autorisation dans la requête
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    // Remplacez l'URL par l'API de votre choix
    axios.get('http://127.0.0.1:8000/api/user', config)
      .then(response => {
        setUserData(response.data.user);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        userData && <Profile user={userData} />
      )}
      {/* Ajoutez d'autres composants ou fonctionnalités de votre application */}
    </div>
  );
};

export default Content_profil;

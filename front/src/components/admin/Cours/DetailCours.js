import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Divider, List, Space, Image, Typography } from 'antd';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const { Title, Text } = Typography;

const DetailCours = () => {
  const { code_matiere } = useParams();
  const [coursDetails, setCoursDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchCoursDetails = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`http://127.0.0.1:8000/api/cours/${code_matiere}`, { headers });
        const data = response.data;

        if (response.status === 200 && data.cours.length > 0) {
          setCoursDetails(data.cours[0]);
        } else {
          console.error("Cours not found");
        }
      } catch (error) {
        console.error("Error fetching cours details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursDetails();
  }, [code_matiere]);

  useEffect(() => {
    if (coursDetails && videoRef.current) {
      videojs(videoRef.current);
    }
  }, [coursDetails]);

  return (
    <div>
      <h2>DetailCours</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : coursDetails ? (
        <>
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card
                title={<Title level={3}>Course Information</Title>}
                bordered
                style={{ width: '100%', textAlign: 'center' }}
              >
                <Space direction="vertical">
                  <Image
                    src={`http://localhost:8000/uploads/cours/images/${coursDetails?.image_cours}`}
                    alt={coursDetails?.libelle}
                    width={200}
                    preview={false}
                  />
                  <Space direction="vertical">
                    <Text strong>Code Matière: {coursDetails?.code_matiere}</Text>
                    <Text strong>Libellé: {coursDetails?.libelle}</Text>
                    <Text strong>Niveau Cours: {coursDetails?.niveau_cours}</Text>
                    <Text strong>Unité d'Enseignement: {coursDetails?.nom_unite}</Text>
                    <Text strong>Professeur: {coursDetails?.nom_professeur}</Text>
                  </Space>
                </Space>
              </Card>
            </Space>
          </div>

          <Divider />

          <Card className="video-list-card">
            <Space direction="vertical">
              <h3>Video Playlist</h3>
              <List
                bordered
                dataSource={coursDetails.video_cours.split(',')}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <video
                      ref={videoRef}
                      className="video-js vjs-default-skin"
                      controls
                      width="400"
                      height="300"
                      data-setup={JSON.stringify({ fluid: true })}
                    >
                      <source src={`http://localhost:8000/uploads/cours/videos/${item}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </List.Item>
                )}
              />
            </Space>
          </Card>

          <Divider />

          <Card>
            <Space direction="vertical">
              <h3>Files</h3>
              <List
                bordered
                dataSource={[coursDetails.fichier_cours]}
                renderItem={(item, index) => (
                  <List.Item key={index}>
                    <a href={`http://localhost:8000/uploads/cours/files/${item}`} target="_blank" rel="noopener noreferrer">
                      {item}
                    </a>
                  </List.Item>
                )}
              />
            </Space>
          </Card>
        </>
      ) : (
        <p>Cours not found</p>
      )}
    </div>
  );
};

export default DetailCours;

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Divider, Space,Image, Typography, List, Row, Col } from 'antd';

const { Title, Text } = Typography;

const DetailCours = () => {
  const { code_matiere } = useParams();
  const [coursDetails, setCoursDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);

  const handleVideoClick = (item) => {
    setSelectedVideo(item);
  };

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
    if (selectedVideo) {
      const videoElement = videoRef.current;

      // Charger la vidéo sélectionnée
      videoElement.src = `http://localhost:8000/uploads/cours/videos/${selectedVideo}`;
      videoElement.load();
    }
  }, [selectedVideo]);

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

          {/* Section pour la liste des vidéos et la vidéo sélectionnée dans une seule carte */}
          <Row gutter={[16, 16]} style={{ backgroundColor: '#ffffff' }}>
            {/* Section pour la liste des vidéos */}
            <Col span={24}>
              <Title
                level={4}
                style={{
                  textAlign: 'center',
                  padding: '8px',
                  backgroundColor: '#ffffff',
                }}
              >
                Video Playlist
              </Title>
            </Col>
            <Col span={5}>
              <Card size="small">
                <List
                  bordered
                  dataSource={coursDetails.video_cours.split(',')}
                  renderItem={(item) => (
                    <List.Item
                      key={item}
                      onClick={() => handleVideoClick(item)}
                      style={{ cursor: 'pointer' }}
                    >
                     <video
                      ref={videoRef}
                      className="video-js"
                      controls
                      width="100%"
                      height="300"
                      data-setup={JSON.stringify({ fluid: true })}
                    >
                      <source src={`http://localhost:8000/uploads/cours/videos/${item}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Section pour afficher la vidéo sélectionnée à côté de la liste */}
            {selectedVideo && (
              <Col span={16} offset={1} style={{ marginTop: '20px' }}>
                <Card size="small" style={{ borderRadius: '10px', height: '100%' }}>
                  <video
                    ref={videoRef}
                    className="video-js vjs-default-skin vjs-big-play-centered"
                    controls
                    style={{ width: '100%', height: '70vh' }}
                  />
                </Card>
              </Col>
            )}
          </Row>

          <Divider />
        </>
      ) : (
        <p>Cours not found</p>
      )}
    </div>
  );
};

export default DetailCours;
  
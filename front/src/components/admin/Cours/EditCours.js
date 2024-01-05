import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Row, Col, Spin, Card } from 'antd';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const { Option } = Select;

const EditCours = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ProfesseurList, setProfesseurList] = useState([]);
  const [UniteList, setUniteList] = useState([]);
  const [CoursInput, setCoursInput] = useState({
    libelle: "",
    image_cours: "",
    fichier_cours: "",
    video_cours: "",
    id_prof: "",
    id_unite: "",
    error_list: {},
  });
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste des utilisateurs
    axios.get(`http://127.0.0.1:8000/api/uniteEnseigns`).then((res) => {
      if (res.data.status === 200) {
        setUniteList(res.data.unites);
      }
    });

    // Récupérer la liste des filières
    axios.get(`http://127.0.0.1:8000/api/professeurs`).then((res) => {
      if (res.data.status === 200) {
        setProfesseurList(res.data.professeurs);
      }
    });

    // Récupérer les données de l'étudiant
    axios.get(`http://127.0.0.1:8000/api/cours/${id}`).then((res) => {
      if (res.data.status === 200) {
        setCoursInput({
          libelle: res.data.cours.libelle,
          image_cours: res.data.cours.image_cours,
          fichier_cours: res.data.cours.fichier_cours,
          video_cours: res.data.cours.video_cours,
          id_prof: res.data.cours.id_prof,
          id_unite: res.data.cours.id_unite,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/user/cours');
      }
    });
  }, [id, navigate]);

  const updateEtudiant = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        libelle: values.libelle,
        image_cours: values.image_cours,
        fichier_cours: values.fichier_cours,
        video_cours: values.video_cours,
        id_prof: values.id_prof,
        id_unite: values.id_unite,
      };

      axios.put(`http://127.0.0.1:8000/api/cours/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
        .then((res) => {
          if (res.data.status === 200) {
            swal('Succès', res.data.message, 'success');
            navigate('/user/cours');
          } else if (res.data.status === 400) {
            setCoursInput({
              ...CoursInput,
              error_list: res.data.error_list,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const handleInput = (e) => {
    e.persist();
    setCoursInput({ ...CoursInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card title="Modification de l'étudiant">
              <div className="card-header">
                <h4>Modification de l'étudiant</h4>
                <NavLink to="/user/cours" className="btn btn-primary btn-sm float-end">
                  <ArrowLeftOutlined /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <Form form={form} onFinish={updateEtudiant}>
                      <Form.Item
                        label="Libellé"
                        name="libelle"
                        initialValue={CoursInput.libelle}
                        rules={[
                          {
                            required: true,
                            message: "Le libellé est requis",
                          },
                        ]}
                      >
                        <Input onChange={handleInput} />
                      </Form.Item>
                      <Form.Item
                        label="Image du cours"
                        name="image_cours"
                        initialValue={CoursInput.image_cours}
                        rules={[
                          {
                            required: true,
                            message: "L'image du cours est requise",
                          },
                        ]}
                      >
                        <Input onChange={handleInput} />
                      </Form.Item>
                      <Form.Item
                        label="Fichier du cours"
                        name="fichier_cours"
                        initialValue={CoursInput.fichier_cours}
                        rules={[
                          {
                            required: true,
                            message: "Le fichier du cours est requis",
                          },
                        ]}
                      >
                        <Input onChange={handleInput} />
                      </Form.Item>
                      <Form.Item
                        label="Video du cours"
                        name="video_cours"
                        initialValue={CoursInput.video_cours}
                        rules={[
                          {
                            required: true,
                            message: "La vidéo du cours est requise",
                          },
                        ]}
                      >
                        <Input onChange={handleInput} />
                      </Form.Item>
                      <Form.Item
                        label="Professeur"
                        name="id_prof"
                        initialValue={CoursInput.id_prof}
                        rules={[
                          {
                            required: true,
                            message: "Le professeur est requis",
                          },
                        ]}
                      >
                        <Select>
                          <Option value="">Sélectionner le professeur</Option>
                          {ProfesseurList.map((prof) => (
                            <Option key={prof.id_prof} value={prof.id_prof}>
                              {prof.name}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Unité d'enseignement"
                        name="id_unite"
                        initialValue={CoursInput.id_unite}
                        rules={[
                          {
                            required: true,
                            message: "L'unité d'enseignement est requise",
                          },
                        ]}
                      >
                        <Select>
                          <Option value="">Sélectionner l'unité d'enseignement</Option>
                          {UniteList.map((unite) => (
                            <Option key={unite.id_unite} value={unite.id_unite}>
                              {unite.nom_unite}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Row>
                        <Col>
                          <Button type="primary" htmlType="submit" block>
                            <CheckCircleOutlined /> Confirmer
                          </Button>
                        </Col>
                        <Col>
                          <NavLink to="/user/cours">
                            <Button type="default" block>
                              <CloseCircleOutlined /> Annuler
                            </Button>
                          </NavLink>
                        </Col>
                      </Row>
                    </Form>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCours;

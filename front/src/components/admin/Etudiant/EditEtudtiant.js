import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Row, Col, Card, Spin } from 'antd';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const { Option } = Select;

const EditEtudiant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filiereList, setFiliereList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [etudiantInput, setEtudiantInput] = useState({
    niveau: '',
    parcours: '',
    id_filiere: '',
    id: '',
    error_list: {},
  });
  const [form] = Form.useForm();
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste des utilisateurs
    axios.get(`http://127.0.0.1:8000/api/nom_etudiant`).then((res) => {
      if (res.data.status === 200) {
        setUserList(res.data.users);
      }
    });

    // Récupérer la liste des filières
    axios.get(`http://127.0.0.1:8000/api/filieres`).then((res) => {
      if (res.data.status === 200) {
        setFiliereList(res.data.filieres);
      }
    });

    // Récupérer les données de l'étudiant
    axios.get(`http://127.0.0.1:8000/api/etudiants/${id}`).then((res) => {
      if (res.data.status === 200) {
        setEtudiantInput({
          niveau: res.data.etudiant.niveau,
          parcours: res.data.etudiant.parcours,
          id_filiere: res.data.etudiant.id_filiere,
          id: res.data.etudiant.id,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/etudiants');
      }
    });
  }, [id, navigate]);

  const updateEtudiant = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        niveau: values.niveau,
        parcours: values.parcours,
        id_filiere: values.id_filiere,
        id_user: values.id,
      };

      axios.put(`http://127.0.0.1:8000/api/etudiants/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Succès', res.data.message, 'success');
            navigate('/admin/etudiants');
          } else if (res.data.status === 400) {
            setEtudiantInput({
              ...etudiantInput,
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
    setEtudiantInput({ ...etudiantInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
          <div className="card-header">
                <NavLink to="/admin/etudiants" className="btn btn-primary btn-sm float-end">
                  <ArrowLeftOutlined /> Retour à l'affichage
                </NavLink>
              </div>
            <Card title="Modification d'un étudiant">
              
              <div className="container">
                <div className="card-body">
                  <Spin spinning={isLoading}>
                    <Form form={form} onFinish={updateEtudiant}>
                      {formError && (
                        <div className="alert alert-danger mb-3">
                          {formError}
                        </div>
                      )}
                      <Form.Item
                        label="Niveau"
                        name="niveau"
                        initialValue={etudiantInput.niveau}
                        rules={[
                          {
                            required: true,
                            message: 'Le niveau est requis',
                          },
                        ]}
                      >
                        <Input onChange={handleInput} />
                      </Form.Item>
                      <Form.Item
                        label="Parcours"
                        name="parcours"
                        initialValue={etudiantInput.parcours}
                        rules={[
                          {
                            required: true,
                            message: 'Le parcours est requis',
                          },
                        ]}
                      >
                        <Input onChange={handleInput} />
                      </Form.Item>
                      <Form.Item
                        label="Filière"
                        name="id_filiere"
                        initialValue={etudiantInput.id_filiere}
                        rules={[
                          {
                            required: true,
                            message: 'La filière est requise',
                          },
                        ]}
                      >
                        <Select>
                          <Option value="">Sélectionner la filière</Option>
                          {filiereList.map((filiere) => (
                            <Option key={filiere.id_filiere} value={filiere.id_filiere}>
                              {filiere.nom_filiere}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label="Utilisateur"
                        name="id"
                        initialValue={etudiantInput.id}
                        rules={[
                          {
                            required: true,
                            message: "L'utilisateur est requis",
                          },
                        ]}
                      >
                        <Select>
                          <Option value="">Sélectionner l'utilisateur</Option>
                          {userList.map((user) => (
                            <Option key={user.id} value={user.id}>
                              {user.name}
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
                          <NavLink to="/admin/etudiants">
                            <Button type="default" block>
                              <CloseCircleOutlined /> Annuler
                            </Button>
                          </NavLink>
                        </Col>
                      </Row>
                    </Form>
                  </Spin>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEtudiant;

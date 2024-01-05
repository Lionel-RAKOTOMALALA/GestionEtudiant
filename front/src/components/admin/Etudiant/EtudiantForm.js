import React, { useEffect, useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";
import { Form, Input, Select, Button, Row, Col, Card, Spin } from "antd";

const { Option } = Select;

const EtudiantForm = () => {
  const [usersList, setUsersList] = useState([]);
  const [filieresList, setFilieresList] = useState([]);
  const [etudiantInput, setEtudiantInput] = useState({
    niveau: "",
    parcours: "",
    id_filiere: "",
    id: "",
    error_list: {},
  });
  const [form] = Form.useForm();
  const [formError, setFormError] = useState("");

  const handleInput = (e) => {
    e.persist();
    setEtudiantInput({
      ...etudiantInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    form.resetFields();
    setFormError("");
  };

  const submitEtudiant = async () => {
    try {
      const values = await form.validateFields();

      // Reset error messages
      setEtudiantInput({
        ...etudiantInput,
        error_list: {},
      });
      setFormError("");

      // Validation on the client side
      const errors = {};
      if (values.niveau === "") {
        errors.niveau = "Le niveau est requis";
      }
      if (values.parcours === "") {
        errors.parcours = "Le parcours est requis";
      }
      if (values.id_filiere === "") {
        errors.id_filiere = "La filière est requise";
      }
      if (values.id === "") {
        errors.id = "L'utilisateur est requis";
      }

      if (Object.keys(errors).length > 0) {
        // Display errors with Swal and in the form
        let errorString;
        if (Object.keys(errors).length > 1) {
          const errorFields = Object.keys(errors).join(" et ");
          errorString = `Les champs "${errorFields}" sont requis`;
        } else {
          const errorField = Object.keys(errors)[0];
          errorString = `Le champ '${errorField}' est requis`;
        }

        setEtudiantInput({
          ...etudiantInput,
          error_list: errors,
        });
        setFormError(errorString);

        swal("Erreurs", errorString, "error");
      } else {
        const data = {
          niveau: values.niveau,
          parcours: values.parcours,
          id_filiere: values.id_filiere,
          id_user: values.id,
        };

        axios.post("http://127.0.0.1:8000/api/etudiants", data).then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Reset form fields
            resetForm();
          } else if (res.data.status === 400) {
            setEtudiantInput({
              ...etudiantInput,
              error_list: res.data.error_list,
            });
          }
        });
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/nom_etudiant").then((res) => {
      if (res.data.status === 200) {
        setUsersList(res.data.users);
      }
    });

    axios.get("http://127.0.0.1:8000/api/filieres").then((res) => {
      if (res.data.status === 200) {
        setFilieresList(res.data.filieres);
      }
    });
  }, []);

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Card title="Ajouter un étudiant">
              <div className="card-header">
                <NavLink to="/admin/etudiants" className="btn btn-primary btn-sm float-end">
                  <ArrowLeftOutlined /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <Spin spinning={false}>
                    <Form form={form} onFinish={submitEtudiant} id="ETUDIANT_FORM" encType="multipart/form-data">
                      {formError && <div className="alert alert-danger mb-3">{formError}</div>}

                      <Form.Item
                        label="Niveau"
                        name="niveau"
                        rules={[{ required: true, message: "Le niveau est requis" }]}
                      >
                        <Input onChange={handleInput} />
                        {etudiantInput.error_list.niveau && (
                          <div className="text-danger">{etudiantInput.error_list.niveau}</div>
                        )}
                      </Form.Item>

                      <Form.Item
                        label="Parcours"
                        name="parcours"
                        rules={[{ required: true, message: "Le parcours est requis" }]}
                      >
                        <Input onChange={handleInput} />
                        {etudiantInput.error_list.parcours && (
                          <div className="text-danger">{etudiantInput.error_list.parcours}</div>
                        )}
                      </Form.Item>

                      <Form.Item
                        label="Filière"
                        name="id_filiere"
                        rules={[{ required: true, message: "La filière est requise" }]}
                      >
                        <Select>
                          <Option value="">Sélectionner la filière</Option>
                          {filieresList.map((filiere) => (
                            <Option key={filiere.id_filiere} value={filiere.id_filiere}>
                              {filiere.nom_filiere}
                            </Option>
                          ))}
                        </Select>
                        {etudiantInput.error_list.id_filiere && (
                          <div className="text-danger">{etudiantInput.error_list.id_filiere}</div>
                        )}
                      </Form.Item>

                      <Form.Item
                        label="Utilisateur"
                        name="id"
                        rules={[{ required: true, message: "L'utilisateur est requis" }]}
                      >
                        <Select>
                          <Option value="">Sélectionner un utilisateur</Option>
                          {usersList.map((user) => (
                            <Option key={user.id} value={user.id}>
                              {user.name}
                            </Option>
                          ))}
                        </Select>
                        {etudiantInput.error_list.id && (
                          <div className="text-danger">{etudiantInput.error_list.id}</div>
                        )}
                      </Form.Item>

                      <Row>
                        <Col>
                          <Button type="primary" htmlType="submit" block>
                            <CheckCircleOutlined /> Confirmer
                          </Button>
                        </Col>
                        <NavLink to="/admin/etudiants" className="col">
                          <Button type="button" block>
                            <CloseCircleOutlined /> Annuler
                          </Button>
                        </NavLink>
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

export default EtudiantForm;

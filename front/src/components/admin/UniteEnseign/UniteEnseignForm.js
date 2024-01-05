import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select, Spin, Modal } from "antd";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";

const { Option } = Select;

const UniteEnseignForm = () => {
  const [filieresList, setFilieresList] = useState([]);
  const [UniteEnseignInput, setUniteEnseignInput] = useState({
    nom_unite: "",
    id_filiere: "",
    error_list: {},
  });
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    e.persist();
    setUniteEnseignInput({
      ...UniteEnseignInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    setUniteEnseignInput({
      nom_unite: "",
      id_filiere: "",
      error_list: {},
    });
    setFormError("");
  };

  const submitUniteEnseign = async (values) => {
    try {
      setLoading(true);

      // Reset error messages
      setUniteEnseignInput({
        ...UniteEnseignInput,
        error_list: {},
      });
      setFormError("");

      // Client-side validation
      const errors = {};
      if (!values.nom_unite) {
        errors.nom_unite = "Le nom_unite est requis";
      }
      if (!values.id_filiere) {
        errors.id_filiere = "La filière est requise";
      }

      if (Object.keys(errors).length > 0) {
        // Display errors using Modal and in the form
        let errorString;
        if (Object.keys(errors).length > 1) {
          const errorFields = Object.keys(errors)
            .map((key) => key)
            .join(" et ");
          errorString = `Les champs "${errorFields}" sont requis`;
        } else {
          const errorField = Object.keys(errors)[0];
          errorString = `Le champ '${errorField}' est requis`;
        }

        setUniteEnseignInput({
          ...UniteEnseignInput,
          error_list: errors,
        });
        setFormError(errorString);

        Modal.error({
          title: "Erreurs",
          content: errorString,
        });
      } else {
        const data = {
          nom_unite: values.nom_unite,
          id_filiere: values.id_filiere,
        };

        const response = await axios.post("http://127.0.0.1:8000/api/uniteEnseigns", data);

        if (response.data.status === 200) {
          Modal.success({
            title: "Success",
            content: response.data.message,
            onOk: resetForm,
          });
        } else if (response.data.status === 400) {
          setUniteEnseignInput({
            ...UniteEnseignInput,
            error_list: response.data.error_list,
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Retrieve the list of filières from the API
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
            <div className="card">
              <div className="card-header">
                <h4>Ajouter une unité d'enseignement</h4>
                <NavLink to="/user/uniteEnseigns" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <Form onFinish={submitUniteEnseign} initialValues={UniteEnseignInput}>
                    {formError && <div className="alert alert-danger mb-3">{formError}</div>}

                    <Form.Item
                      label="Nom de l'unité d'enseignement"
                      name="nom_unite"
                      rules={[{ required: true, message: "Le nom de l'unité est requis" }]}
                    >
                      <Input onChange={handleInput} />
                    </Form.Item>

                    <Form.Item
                      label="Filière"
                      name="id_filiere"
                      rules={[{ required: true, message: "La filière est requise" }]}
                    >
                      <Select onChange={(value) => setUniteEnseignInput({ ...UniteEnseignInput, id_filiere: value })}>
                        <Option value="">Sélectionner la filière</Option>
                        {filieresList.map((filiere) => (
                          <Option key={filiere.id_filiere} value={filiere.id_filiere}>
                            {filiere.nom_filiere}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item>
                      <div className="row">
                        <div className="col">
                          <Button type="primary" htmlType="submit" className="btn-block mb-2" loading={loading}>
                            <UilCheckCircle size="20" /> Confirmer
                          </Button>
                        </div>
                        <NavLink to="/user/uniteEnseigns" className="col">
                          <Button type="button" className="btn-secondary btn-block mb-2">
                            <UilTimes size="20" /> Annuler
                          </Button>
                        </NavLink>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniteEnseignForm;

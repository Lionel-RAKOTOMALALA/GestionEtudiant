import React, { useEffect, useState } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const TechnicienForm = () => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/users`).then((res) => {
      if (res.data.status === 200) {
        setUserList(res.data.users);
      }
    });
  }, []);

  const [technicienInput, setTechnicienInput] = useState({
    competence: "",
    id_user: "",
    error_list: {},
  });
  const [formError, setFormError] = useState("");

  const handleInput = (e) => {
    e.persist();
    setTechnicienInput({
      ...technicienInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    setTechnicienInput({
      competence: "",
      id_user: "",
      error_list: {},
    });
    setFormError("");
  };

  const submitTechnicien = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setTechnicienInput({
      ...technicienInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (technicienInput.competence === "") {
      errors.competence = "La compétence est requise";
    }
    if (technicienInput.id_user === "") {
      errors.id_user = "Le nom du technicien est requis";
    }

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les avec Swal et dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors)
          .map((key) => {
            if (key === "competence") {
              return "Compétence";
            } else if (key === "id_user") {
              return "Nom du technicien";
            }
            return key;
          })
          .join(" et ");
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === "competence") {
          errorString = "Le champ 'Compétence' est requis";
        } else if (errorField === "id_user") {
          errorString = "Le champ 'Nom du technicien' est requis";
        }
      }

      setTechnicienInput({
        ...technicienInput,
        error_list: errors,
      });
      setFormError(errorString);

      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        competence: technicienInput.competence,
        id_user: technicienInput.id_user,
      };

      axios
        .post("http://127.0.0.1:8000/api/techniciens", data)
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Réinitialisez les champs du formulaire
            resetForm();
          } else if (res.data.status === 400) {
            setTechnicienInput({
              ...technicienInput,
              error_list: res.data.errors,
            });
          }
        });
    }
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Spécialisation d'un technicien</h4>
                <NavLink
                  to="/admin/techniciens"
                  className="btn btn-primary btn-sm float-end"
                >
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <form onSubmit={submitTechnicien} id="TECHNICIEN_FORM" encType="multipart/form-data">
                    {formError && (
                      <div className="alert alert-danger mb-3">
                        {formError}
                      </div>
                    )}
                    <div className="form-group mb-3">
                      <label htmlFor="competence">Compétence</label>
                      <input
                        type="text"
                        name="competence"
                        className={`form-control ${
                          technicienInput.error_list.competence
                            ? "is-invalid"
                            : ""
                        }`}
                        onChange={handleInput}
                        value={technicienInput.competence}
                      />
                      {technicienInput.error_list.competence && (
                        <div className="text-danger">
                          {technicienInput.error_list.competence}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="id_user">Nom du technicien</label>
                      <select name="id_user" onChange={handleInput} value={technicienInput.id_user} className="form-control">
                        <option value="">Sélectionner un technicien</option>
                        {userList.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.username}
                            </option>
                          );
                        })}
                      </select>
                      {technicienInput.error_list.id_user && (
                        <div className="text-danger">
                          {technicienInput.error_list.id_user}
                        </div>
                      )}
                    </div>

                    <div className="row">
                      <div className="col">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block mb-2"
                        >
                          <UilCheckCircle size="20" /> Confirmer
                        </button>
                      </div>
                      <NavLink to="/admin/techniciens" className="col">
                        <button
                          type="button"
                          className="btn btn-secondary btn-block mb-2"
                        >
                          <UilTimes size="20" /> Annuler
                        </button>
                      </NavLink>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicienForm;

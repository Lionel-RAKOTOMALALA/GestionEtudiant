import React, { useEffect, useState } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const EtudiantForm = () => {
  const [usersList, setUsersList] = useState([]);
  const [professeurInput, setprofesseurInput] = useState({
    matiere_enseign: "",
    id: "",
    error_list: {},
  });
  const [formError, setFormError] = useState("");

  const handleInput = (e) => {
    e.persist();
    setprofesseurInput({
      ...professeurInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    setprofesseurInput({
      matiere_enseign: "",
      id: "",
      error_list: {},
    });
    setFormError("");
  };

  const submitEtudiant = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setprofesseurInput({
      ...professeurInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (professeurInput.matiere_enseign === "") {
      errors.matiere_enseign = "Le matiere_enseign est requis";
    }
    if (professeurInput.id === "") {
      errors.id = "L'utilisateur est requis";
    }

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les avec Swal et dans le formulaire
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

      setprofesseurInput({
        ...professeurInput,
        error_list: errors,
      });
      setFormError(errorString);

      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        matiere_enseign: professeurInput.matiere_enseign,
        user_id: professeurInput.id,
      };

      axios
        .post("http://127.0.0.1:8000/api/professeurs", data)
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Réinitialisez les champs du formulaire
            resetForm();
          } else if (res.data.status === 400) {
            setprofesseurInput({
              ...professeurInput,
              error_list: res.data.error_list,
            });
          }
        });
    }
  };

  useEffect(() => {
    // Récupérer la liste des utilisateurs depuis l'API
    axios.get("http://127.0.0.1:8000/api/users").then((res) => {
      if (res.data.status === 200) {
        setUsersList(res.data.users);
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
                <h4>Spécialisation d'un professeur</h4>
                <NavLink
                  to="/admin/etudiants"
                  className="btn btn-primary btn-sm float-end"
                >
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <form
                    onSubmit={submitEtudiant}
                    id="ETUDIANT_FORM"
                    encType="multipart/form-data"
                  >
                    {formError && (
                      <div className="alert alert-danger mb-3">
                        {formError}
                      </div>
                    )}

                    <div className="form-group mb-3">
                      <label htmlFor="matiere_enseign">matiere_enseign</label>
                      <input
                        type="text"
                        name="matiere_enseign"
                        className={`form-control ${
                          professeurInput.error_list.matiere_enseign ? "is-invalid" : ""
                        }`}
                        onChange={handleInput}
                        value={professeurInput.matiere_enseign}
                      />
                      {professeurInput.error_list.matiere_enseign && (
                        <div className="text-danger">
                          {professeurInput.error_list.matiere_enseign}
                        </div>
                      )}
                    </div>
                    
                    <div className="form-group mb-3">
                      <label htmlFor="id">Utilisateur</label>
                      <select
                        name="id"
                        onChange={handleInput}
                        value={professeurInput.id}
                        className={`form-control ${
                          professeurInput.error_list.id ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Sélectionner un utilisateur</option>
                        {usersList.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                      {professeurInput.error_list.id && (
                        <div className="text-danger">
                          {professeurInput.error_list.id}
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
                      <NavLink to="/admin/professeurs" className="col">
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

export default EtudiantForm;

  import React, { useEffect, useState } from "react";
  import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
  import axios from "axios";
  import swal from "sweetalert";
  import { NavLink } from "react-router-dom";

  const EtudiantForm = () => {
    const [usersList, setUsersList] = useState([]);
    const [filieresList, setFilieresList] = useState([]);  // Ajout de la liste des filières
    const [etudiantInput, setEtudiantInput] = useState({
      niveau: "",
      parcours: "",
      id_filiere: "",
      id: "",
      error_list: {},
    });
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
      setEtudiantInput({
        niveau: "",
        parcours: "",
        id_filiere: "",
        id: "",
        error_list: {},
      });
      setFormError("");
    };

    const submitEtudiant = (e) => {
      e.preventDefault();

      // Réinitialisez les messages d'erreur
      setEtudiantInput({
        ...etudiantInput,
        error_list: {},
      });
      setFormError("");

      // Validation côté client
      const errors = {};
      if (etudiantInput.niveau === "") {
        errors.niveau = "Le niveau est requis";
      }
      if (etudiantInput.parcours === "") {
        errors.parcours = "Le parcours est requis";
      }
      if (etudiantInput.id_filiere === "") {
        errors.id_filiere = "La filière est requise";
      }
      if (etudiantInput.id === "") {
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

        setEtudiantInput({
          ...etudiantInput,
          error_list: errors,
        });
        setFormError(errorString);

        swal("Erreurs", errorString, "error");
      } else {
        const data = {
          niveau: etudiantInput.niveau,
          parcours: etudiantInput.parcours,
          id_filiere: etudiantInput.id_filiere,
          id_user: etudiantInput.id,
        };

        axios
          .post("http://127.0.0.1:8000/api/etudiants", data)
          .then((res) => {
            if (res.data.status === 200) {
              swal("Success", res.data.message, "success");

              // Réinitialisez les champs du formulaire
              resetForm();
            } else if (res.data.status === 400) {
              setEtudiantInput({
                ...etudiantInput,
                error_list: res.data.error_list,
              });
            }
          });
      }
    };

    useEffect(() => {
      // Récupérer la liste des utilisateurs depuis l'API
      axios.get("http://127.0.0.1:8000/api/nom_etudiant").then((res) => {
        if (res.data.status === 200) {
          setUsersList(res.data.users);
        }
      });

      // Récupérer la liste des filières depuis l'API
      axios.get("http://127.0.0.1:8000/api/filieres").then((res) => {
        if (res.data.status === 200) {
          setFilieresList(res.data.filieres);  // mise à jour de filieresList
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
                  <h4>Ajouter un étudiant</h4>
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
                        <label htmlFor="niveau">Niveau</label>
                        <input
                          type="text"
                          name="niveau"
                          className={`form-control ${
                            etudiantInput.error_list.niveau ? "is-invalid" : ""
                          }`}
                          onChange={handleInput}
                          value={etudiantInput.niveau}
                        />
                        {etudiantInput.error_list.niveau && (
                          <div className="text-danger">
                            {etudiantInput.error_list.niveau}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="parcours">Parcours</label>
                        <input
                          type="text"
                          name="parcours"
                          className={`form-control ${
                            etudiantInput.error_list.parcours ? "is-invalid" : ""
                          }`}
                          onChange={handleInput}
                          value={etudiantInput.parcours}
                        />
                        {etudiantInput.error_list.parcours && (
                          <div className="text-danger">
                            {etudiantInput.error_list.parcours}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="id_filiere">Filière</label>
                        <select
                          name="id_filiere"
                          onChange={handleInput}
                          value={etudiantInput.id_filiere}
                          className={`form-control ${
                            etudiantInput.error_list.id_filiere ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Sélectionner la filière</option>
                          {filieresList.map((filiere) => (
                            <option key={filiere.id_filiere} value={filiere.id_filiere}>
                              {filiere.nom_filiere}
                            </option>
                          ))}
                        </select>
                        {etudiantInput.error_list.id_filiere && (
                          <div className="text-danger">
                            {etudiantInput.error_list.id_filiere}
                          </div>
                          )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="id">Utilisateur</label>
                        <select
                          name="id"
                          onChange={handleInput}
                          value={etudiantInput.id}
                          className={`form-control ${
                            etudiantInput.error_list.id ? "is-invalid" : ""
                          }`}
                        >
                          <option value="">Sélectionner un utilisateur</option>
                          {usersList.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name}
                            </option>
                          ))}
                        </select>
                        {etudiantInput.error_list.id && (
                          <div className="text-danger">
                            {etudiantInput.error_list.id}
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
                        <NavLink to="/admin/etudiants" className="col">
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

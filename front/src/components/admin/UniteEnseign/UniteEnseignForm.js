import React, { useEffect, useState } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const UniteEnseignForm = () => {
  const [filieresList, setFilieresList] = useState([]); 
  const [UniteEnseignInput, setUniteEnseignInput] = useState({
    nom_unite: "",
    id_filiere: "",
    error_list: {},
  });
  const [formError, setFormError] = useState("");

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

  const submitEtudiant = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setUniteEnseignInput({
      ...UniteEnseignInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (UniteEnseignInput.nom_unite === "") {
      errors.nom_unite = "Le nom_unite est requis";
    }
    if (UniteEnseignInput.id_filiere === "") {
      errors.id_filiere = "La filière est requise";
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

      setUniteEnseignInput({
        ...UniteEnseignInput,
        error_list: errors,
      });
      setFormError(errorString);

      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        nom_unite: UniteEnseignInput.nom_unite,
        id_filiere: UniteEnseignInput.id_filiere,
      };

      axios
        .post("http://127.0.0.1:8000/api/uniteEnseigns", data)
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Réinitialisez les champs du formulaire
            resetForm();
          } else if (res.data.status === 400) {
            setUniteEnseignInput({
              ...UniteEnseignInput,
              error_list: res.data.error_list,
            });
          }
        });
    }
  };

  useEffect(() => {
    

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
                  to="/user/uniteEnseigns"
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
                      <label htmlFor="nom_unite">nom_unite</label>
                      <input
                        type="text"
                        name="nom_unite"
                        className={`form-control ${
                          UniteEnseignInput.error_list.nom_unite ? "is-invalid" : ""
                        }`}
                        onChange={handleInput}
                        value={UniteEnseignInput.nom_unite}
                      />
                      {UniteEnseignInput.error_list.nom_unite && (
                        <div className="text-danger">
                          {UniteEnseignInput.error_list.nom_unite}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="id_filiere">Filière</label>
                      <select
                        name="id_filiere"
                        onChange={handleInput}
                        value={UniteEnseignInput.id_filiere}
                        className={`form-control ${
                          UniteEnseignInput.error_list.id_filiere ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Sélectionner la filière</option>
                        {filieresList.map((filiere) => (
                          <option key={filiere.id_filiere} value={filiere.id_filiere}>
                            {filiere.nom_filiere}
                          </option>
                        ))}
                      </select>
                      {UniteEnseignInput.error_list.id_filiere && (
                        <div className="text-danger">
                          {UniteEnseignInput.error_list.id_filiere}
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
                      <NavLink to="/user/uniteEnseigns" className="col">
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

export default UniteEnseignForm;

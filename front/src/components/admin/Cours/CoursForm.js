import React, { useEffect, useState } from "react";
import { UilCheckCircle, UilTimes, UilArrowCircleLeft } from "@iconscout/react-unicons";
import axios from "axios";
import swal from "sweetalert";
import { NavLink } from "react-router-dom";

const CoursForm = () => {
  const [UniteList, setUniteList] = useState([]);
  const [ProfesseurList, setProfesseurList] = useState([]);  // Ajout de la liste des filières
  const [CoursInput, setCoursInput] = useState({
    libelle: "",
    image_cours: "",
    fichier_cours : "",
    video_cours: "",
    id_prof: "",
    id_unite: "",
    error_list: {},
  });
  const [formError, setFormError] = useState("");

  const handleInput = (e) => {
    e.persist();
    setCoursInput({
      ...CoursInput,
      [e.target.name]: e.target.value,
    });
    setFormError("");
  };

  const resetForm = () => {
    setCoursInput({
      libelle: "",
      image_cours: "",
      fichier_cours : "",
      video_cours: "",
      id_prof: "",
      id_unite: "",
      error_list: {},
    });
    setFormError("");
  };

  const submitCours = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setCoursInput({
      ...CoursInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (CoursInput.libelle === "") {
      errors.libelle = "Le libelle est requis";
    }
    if (CoursInput.image_cours === "") {
      errors.image_cours = "Le image_cours est requis";
    }
    if (CoursInput.fichier_cours === "") {
      errors.image_cours = "Le fichier_cours est requis";
    }
    if (CoursInput.video_cours === "") {
      errors.image_cours = "Le video_cours est requis";
    }
    if (CoursInput.id_prof === "") {
      errors.id_prof = "La filière est requise";
    }
    if (CoursInput.id === "") {
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

      setCoursInput({
        ...CoursInput,
        error_list: errors,
      });
      setFormError(errorString);

      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        libelle: CoursInput.libelle,
        image_cours: CoursInput.image_cours,
        fichier_cours : CoursInput.fichier_cours,
        video_cours: CoursInput.video_cours,
        id_prof: CoursInput.id_prof,
        id_unite: CoursInput.id_unite,
    };
    
    console.log(data);
      axios
        .post("http://127.0.0.1:8000/api/cours", data)
        .then((res) => {
          if (res.data.status === 200) {
            swal("Success", res.data.message, "success");

            // Réinitialisez les champs du formulaire
            resetForm();
          } else if (res.data.status === 400) {
            setCoursInput({
              ...CoursInput,
              error_list: res.data.error_list,
            });
          }
        });
    }
  };

  useEffect(() => {
    // Récupérer la liste des utilisateurs depuis l'API
    axios.get("http://127.0.0.1:8000/api/uniteEnseigns").then((res) => {
      if (res.data.status === 200) {
        setUniteList(res.data.unites);
      }
    });
    
    // Récupérer la liste des filières depuis l'API
    axios.get("http://127.0.0.1:8000/api/professeurs").then((res) => {
        if (res.data.status === 200) {
            setProfesseurList(res.data.professeurs);  // mise à jour de ProfesseurList
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
                  to="/admin/Cours"
                  className="btn btn-primary btn-sm float-end"
                >
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <form
                    onSubmit={submitCours}
                    id="Cours_FORM"
                    encType="multipart/form-data"
                  >
                    {formError && (
                      <div className="alert alert-danger mb-3">
                        {formError}
                      </div>
                    )}

                    <div className="form-group mb-3">
                      <label htmlFor="libelle">libelle</label>
                      <input
                        type="text"
                        name="libelle"
                        className={`form-control ${
                          CoursInput.error_list.libelle ? "is-invalid" : ""
                        }`}
                        onChange={handleInput}
                        value={CoursInput.libelle}
                      />
                      {CoursInput.error_list.libelle && (
                        <div className="text-danger">
                          {CoursInput.error_list.libelle}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="image_cours">image_cours</label>
                      <input
                        type="text"
                        name="image_cours"
                        className={`form-control ${
                          CoursInput.error_list.image_cours ? "is-invalid" : ""
                        }`}
                        onChange={handleInput}
                        value={CoursInput.image_cours}
                      />
                      {CoursInput.error_list.image_cours && (
                        <div className="text-danger">
                          {CoursInput.error_list.image_cours}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="fichier_cours">Fichier</label>
                      <input
                        type="text"
                        name="fichier_cours"
                        className={`form-control ${
                          CoursInput.error_list.fichier_cours ? "is-invalid" : ""
                        }`}
                        onChange={handleInput}
                        value={CoursInput.fichier_cours}
                      />
                      {CoursInput.error_list.fichier_cours && (
                        <div className="text-danger">
                          {CoursInput.error_list.fichier_cours}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="video_cours">Video</label>
                      <input
                        type="text"
                        name="video_cours"
                        className={`form-control ${
                          CoursInput.error_list.video_cours ? "is-invalid" : ""
                        }`}
                        onChange={handleInput}
                        value={CoursInput.video_cours}
                      />
                      {CoursInput.error_list.video_cours && (
                        <div className="text-danger">
                          {CoursInput.error_list.video_cours}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="id_prof">Professeur</label>
                      <select
                        name="id_prof"
                        onChange={handleInput}
                        value={CoursInput.id_prof}
                        className={`form-control ${
                          CoursInput.error_list.id_prof ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Sélectionner la filière</option>
                        {ProfesseurList.map((prof) => (
                          <option key={prof.id} value={prof.id}>
                            {prof.name}
                          </option>
                        ))}
                      </select>
                      {CoursInput.error_list.id_prof && (
                        <div className="text-danger">
                          {CoursInput.error_list.id_prof}
                        </div>
                        )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="id_unite">Unité d'enseignement</label>
                      <select
                        name="id_unite"
                        onChange={handleInput}
                        value={CoursInput.id}
                        className={`form-control ${
                          CoursInput.error_list.id ? "is-invalid" : ""
                        }`}
                      >
                        <option value="">Sélectionner un unité d'enseignement</option>
                        {UniteList.map((unite) => (
                          <option key={unite.id_unite} value={unite.id_unite}>
                            {unite.nom_unite}
                          </option>
                        ))}
                      </select>
                      {CoursInput.error_list.id && (
                        <div className="text-danger">
                          {CoursInput.error_list.id}
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
                      <NavLink to="/admin/Cours" className="col">
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

export default CoursForm;

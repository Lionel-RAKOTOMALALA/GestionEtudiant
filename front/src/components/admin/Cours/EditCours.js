import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditCours = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ProfesseurList, setProfesseurList] = useState([]);
  const [UniteList, setUniteList] = useState([]);
  const [CoursInput, setCoursInput] = useState({
    libelle: "",
    image_cours: "",
    fichier_cours : "",
    video_cours: "",
    id_prof: "",
    id_unite: "",
    error_list: {},
  });
  const [formError, setFormError] = useState('');
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
        navigate('/admin/cours');
      }
    });
  }, [id, navigate]);

  const updateEtudiant = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setCoursInput({
      ...CoursInput,
      error_list: {},
    });
    setFormError('');

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
      // Il y a des erreurs, affichez-les dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors).join(' et ');
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
      swal('Erreurs', errorString, 'error');
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        libelle: CoursInput.libelle,
        image_cours: CoursInput.image_cours,
        fichier_cours : CoursInput.fichier_cours,
        video_cours: CoursInput.video_cours,
        id_prof: CoursInput.id_prof,
        id_unite: CoursInput.id_unite,
      };
      console.log(data);
      axios.put(`http://127.0.0.1:8000/api/cours/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Succès', res.data.message, 'success');
            navigate('/admin/cours');
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
    }
  };

  const handleInput = (e) => {
    e.persist();
    setCoursInput({ ...CoursInput, [e.target.name]: e.target.value });
  };
  console.log(CoursInput.id);
  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification de l'étudiant</h4>
                <NavLink to="/admin/cours" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <form onSubmit={updateEtudiant}>
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
                          className={`form-control ${CoursInput.error_list.libelle ? 'is-invalid' : ''}`}
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
                          className={`form-control ${CoursInput.error_list.image_cours ? 'is-invalid' : ''}`}
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
                        <label htmlFor="fichier_cours">Fichier du cours</label>
                        <input
                          type="text"
                          name="fichier_cours"
                          className={`form-control ${CoursInput.error_list.image_cours ? 'is-invalid' : ''}`}
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
                        <label htmlFor="video_cours">Video du cours</label>
                        <input
                          type="text"
                          name="video_cours"
                          className={`form-control ${CoursInput.error_list.video_cours ? 'is-invalid' : ''}`}
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
                          className={`form-control ${CoursInput.error_list.id_prof ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner le professeur</option>
                          {ProfesseurList.map((prof) => (
                            <option key={prof.id_prof} value={prof.id_prof} selected={prof.name === CoursInput.id_prof}>
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
                          value={CoursInput.id_unite}
                          className={`form-control ${CoursInput.error_list.id_unite ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner l'utilisateur</option>
                          {UniteList.map((unite) => (
                            <option key={unite.id_unite} value={unite.id_unite} selected={unite.id_unite === CoursInput.id_unite}>
                              {unite.nom_unite}
                            </option>
                          ))}
                        </select>
                        {CoursInput.error_list.id_unite && (
                          <div className="text-danger">
                            {CoursInput.error_list.id_unite}
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
                        <NavLink to="/admin/cours" className="col">
                          <button
                            type="button"
                            className="btn btn-secondary btn-block mb-2"
                          >
                            <UilTimes size="20" /> Annuler
                          </button>
                        </NavLink>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCours;

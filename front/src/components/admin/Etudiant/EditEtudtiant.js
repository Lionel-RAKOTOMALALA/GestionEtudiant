import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditEtudiant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filiereList, setFiliereList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [etudiantInput, setEtudiantInput] = useState({
    niveau: '',
    parcours: '',
    id_filiere: '',
    id: '', // Vous devrez mettre la bonne valeur ici
    error_list: {},
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste des utilisateurs
    axios.get(`http://127.0.0.1:8000/api/users`).then((res) => {
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

  const updateEtudiant = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setEtudiantInput({
      ...etudiantInput,
      error_list: {},
    });
    setFormError('');

    // Validation côté client
    const errors = {};
    if (etudiantInput.niveau === '') {
      errors.niveau = 'Le niveau est requis';
    }
    if (etudiantInput.parcours === '') {
      errors.parcours = 'Le parcours est requis';
    }
    if (etudiantInput.id_filiere === '') {
      errors.id_filiere = 'La filière est requise';
    }
    if (etudiantInput.id === '') {
      errors.id = 'L\'utilisateur est requis';
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

      setEtudiantInput({
        ...etudiantInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal('Erreurs', errorString, 'error');
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        niveau: etudiantInput.niveau,
        parcours: etudiantInput.parcours,
        id_filiere: etudiantInput.id_filiere,
        id_user: etudiantInput.id,
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
    }
  };

  const handleInput = (e) => {
    e.persist();
    setEtudiantInput({ ...etudiantInput, [e.target.name]: e.target.value });
  };
  console.log(etudiantInput.id);
  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification de l'étudiant</h4>
                <NavLink to="/admin/etudiants" className="btn btn-primary btn-sm float-end">
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
                        <label htmlFor="niveau">Niveau</label>
                        <input
                          type="text"
                          name="niveau"
                          className={`form-control ${etudiantInput.error_list.niveau ? 'is-invalid' : ''}`}
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
                          className={`form-control ${etudiantInput.error_list.parcours ? 'is-invalid' : ''}`}
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
                          className={`form-control ${etudiantInput.error_list.id_filiere ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner la filière</option>
                          {filiereList.map((filiere) => (
                            <option key={filiere.id_filiere} value={filiere.id_filiere} selected={filiere.nom_filiere === etudiantInput.id_filiere}>
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
                          className={`form-control ${etudiantInput.error_list.id ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner l'utilisateur</option>
                          {userList.map((user) => (
                            <option key={user.id} value={user.id} selected={user.id === etudiantInput.id}>
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

export default EditEtudiant;

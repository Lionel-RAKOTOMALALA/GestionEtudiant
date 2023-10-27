import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditEtudiant = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userList, setUserList] = useState([]);
  const [professeurInput, setprofesseurInput] = useState({
    matiere_enseign: '',
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

   

    // Récupérer les données de l'étudiant
    axios.get(`http://127.0.0.1:8000/api/professeurs/${id}`).then((res) => {
      if (res.data.status === 200) {
        setprofesseurInput({
          matiere_enseign: res.data.professeur.matiere_enseign,
          id: res.data.professeur.id, 
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/professeurs');
      }
    });
  }, [id, navigate]);

  const updateEtudiant = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setprofesseurInput({
      ...professeurInput,
      error_list: {},
    });
    setFormError('');

    // Validation côté client
    const errors = {};
    if (professeurInput.matiere_enseign === '') {
      errors.matiere_enseign = 'Le matiere_enseign est requis';
    }
    if (professeurInput.id === '') {
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

      setprofesseurInput({
        ...professeurInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal('Erreurs', errorString, 'error');
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        matiere_enseign: professeurInput.matiere_enseign,
        user_id: professeurInput.id,
      };
      axios.put(`http://127.0.0.1:8000/api/professeurs/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Succès', res.data.message, 'success');
            navigate('/admin/professeurs');
          } else if (res.data.status === 400) {
            setprofesseurInput({
              ...professeurInput,
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
    setprofesseurInput({ ...professeurInput, [e.target.name]: e.target.value });
  };
  console.log(professeurInput.id);
  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification du professeur</h4>
                <NavLink to="/admin/professeurs" className="btn btn-primary btn-sm float-end">
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
                        <label htmlFor="matiere_enseign">matiere_enseign</label>
                        <input
                          type="text"
                          name="matiere_enseign"
                          className={`form-control ${professeurInput.error_list.matiere_enseign ? 'is-invalid' : ''}`}
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
                          className={`form-control ${professeurInput.error_list.id ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner l'utilisateur</option>
                          {userList.map((user) => (
                            <option key={user.id} value={user.id} selected={user.id === professeurInput.id}>
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

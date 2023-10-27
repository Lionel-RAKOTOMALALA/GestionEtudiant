import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditTechnicien = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const { id } = useParams();
  const [technicienInput, setTechnicienInput] = useState({
    competence: '',
    nom_utilisateur: '',
    id_user: '',
    error_list: {},
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la liste des utilisateurs
    axios.get(`http://127.0.0.1:8000/api/users`).then((res) => {
      if (res.data.status === 200) {
        setUserList(res.data.users);
      }
    });

    // Récupérer les données du technicien
    axios.get(`http://127.0.0.1:8000/api/techniciens/${id}`).then((res) => {
      if (res.data.status === 200) {
        setTechnicienInput({
          competence: res.data.technicien.competence,
          nom_utilisateur: res.data.technicien.username,
          id_user: res.data.technicien.id,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/techniciens');
      }
    });
  }, [id, navigate]);

  const updateTechnicien = (e) => {
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
    errors.competence = "Compétence est requise";
  }
  if (technicienInput.nom_utilisateur === "") {
    errors.nom_utilisateur = "Nom d'utilisateur est requis";
  }

  if (Object.keys(errors).length > 0) {
    // Il y a des erreurs, affichez-les dans le formulaire
    let errorString;
    if (Object.keys(errors).length > 1) {
      const errorFields = Object.keys(errors).map((key) => {
        if (key === "competence") {
          return "Compétence";
        } else if (key === "nom_utilisateur") {
          return "Nom d'utilisateur";
        }
        return key;
      }).join(" et ");
      errorString = `Les champs "${errorFields}" sont requis`;
    } else {
      const errorField = Object.keys(errors)[0];
      if (errorField === "competence") {
        errorString = "Le champ 'Compétence' est requis";
      } else if (errorField === "nom_utilisateur") {
        errorString = "Le champ 'Nom d'utilisateur' est requis";
      }
    }

    setTechnicienInput({
      ...technicienInput,
      error_list: errors,
    });
    setFormError(errorString);
    swal("Erreurs", errorString, "error");
  } else {
    // Pas d'erreurs, procéder à la requête Axios
    const data = {
      competence: technicienInput.competence,
      id_user: technicienInput.id_user,
      
    };
    axios.put(`http://127.0.0.1:8000/api/techniciens/${id}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          swal('Success', res.data.message, 'success');
          navigate('/admin/techniciens');
        } else if (res.data.status === 400) {
          setTechnicienInput({
            ...technicienInput,
            error_list: res.data.errors,
          });
        } else if (res.data.status === 404) {
          swal("Erreur", res.data.message, "error");
          navigate('/admin/techniciens');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

const handleInput = (e) => {
  e.persist();
  setTechnicienInput({ ...technicienInput, [e.target.name]: e.target.value });
};


  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification du technicien</h4>
                <NavLink to="/admin/techniciens" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <form onSubmit={updateTechnicien}>
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
                          className={`form-control ${technicienInput.error_list.competence ? 'is-invalid' : ''}`}
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
                        <select
                          name="id_user"
                          onChange={handleInput}
                          value={technicienInput.id_user}
                          className={`form-control ${technicienInput.error_list.id_user ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner un technicien</option>
                          {userList.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.username}
                            </option>
                          ))}
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

export default EditTechnicien;

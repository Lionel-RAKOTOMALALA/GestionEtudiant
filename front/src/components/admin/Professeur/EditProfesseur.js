import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditDemandeur = () => {
  const [userList, setUserList] = useState([]);
  const [posteList, setPosteList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [demandeurInput, setDemandeurInput] = useState({
    id_user: '',
    id_poste: '',
    error_list: {},
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/newUserSpecialisation`).then((res) => {
      if (res.data.status === 200) {
        setUserList(res.data.users);
      }
    });

    axios.get(`http://127.0.0.1:8000/api/postes`).then((res) => {
      if (res.data.status === 200) {
        setPosteList(res.data.postes);
      }
    });

    axios.get(`http://127.0.0.1:8000/api/demandeurs/${id}`).then((res) => {
      if (res.data.status === 200) {
        setDemandeurInput({
          id_user: res.data.demandeur.user_id, // Remarquez le changement ici
          id_poste: res.data.demandeur.id_poste,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/demandeurs');
      }
    });
  }, [id, navigate]);

  const updateDemandeur = (e) => {
    e.preventDefault();
    // Réinitialisez les messages d'erreur
    setDemandeurInput({
      ...demandeurInput,
      error_list: {},
    });
    setFormError("");

    // Validation côté client
    const errors = {};
    if (demandeurInput.id_user === "") {
      errors.id_user = "Utilisateur est requis";
    }
    if (demandeurInput.id_poste === "") {
      errors.id_poste = "Poste est requis";
    }

    if (Object.keys(errors).length > 0) {
      // Il y a des erreurs, affichez-les dans le formulaire
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors).map((key) => {
          if (key === "id_user") {
            return "Utilisateur";
          } else if (key === "id_poste") {
            return "Poste";
          }
          return key;
        }).join(" et ");
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === "id_user") {
          errorString = "Le champ 'Utilisateur' est requis";
        } else if (errorField === "id_poste") {
          errorString = "Le champ 'Poste' est requis";
        }
      }

      setDemandeurInput({
        ...demandeurInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal("Erreurs", errorString, "error");
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        user_id: demandeurInput.id_user, // Remarquez le changement ici
        id_poste: demandeurInput.id_poste,
      };
      axios.put(`http://127.0.0.1:8000/api/demandeurs/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Success', res.data.message, 'success');
            navigate('/admin/demandeurs');
          } else if (res.data.status === 400) {
            setDemandeurInput({
              ...demandeurInput,
              error_list: res.data.errors,
            });
          } else {
            swal("Erreur", res.data.message, "error");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleInput = (e) => {
    e.persist();
    setDemandeurInput({ ...demandeurInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification du demandeur</h4>
                <NavLink to="/admin/demandeurs" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <form onSubmit={updateDemandeur}>
                      {formError && (
                        <div className="alert alert-danger mb-3">
                          {formError}
                        </div>
                      )}
                     <div className="form-group mb-3">
                      <label htmlFor="id_user">Nom du demandeur</label>
                      <select name="id_user" onChange={handleInput} value={demandeurInput.id_user} className="form-control">
                        <option value="">Sélectionner un demandeur</option>
                        {userList.map((item) => {
                          return (
                            <option key={item.id} value={item.id}>
                              {item.username} {/* Remarquez le changement ici */}
                            </option>
                          );
                        })}
                      </select>
                      {demandeurInput.error_list.id_user && (
                        <div className="text-danger">
                          {demandeurInput.error_list.id_user}
                        </div>
                      )}
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="id_poste">Poste</label>
                      <select
                        name="id_poste"
                        onChange={handleInput}
                        value={demandeurInput.id_poste}
                        className={`form-control ${
                          demandeurInput.error_list.id_poste
                            ? "is-invalid"
                            : ""
                        }`}
                      >
                        <option value="">Sélectionner un poste</option>
                        {posteList.map((poste) => {
                          return (
                            <option key={poste.id_poste} value={poste.id_poste}>
                              {poste.nom_poste}
                            </option>
                          );
                        })}
                      </select>
                      {demandeurInput.error_list.id_poste && (
                        <div className="text-danger">
                          {demandeurInput.error_list.id_poste}
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
                        <NavLink to="/admin/demandeurs" className="col">
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

export default EditDemandeur;

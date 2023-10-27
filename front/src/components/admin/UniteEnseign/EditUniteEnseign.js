import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditUniteEnseign = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [filiereList, setFiliereList] = useState([]);
  const [UniteEnseignInput, setUniteEnseignInput] = useState({
    nom_unite: '',
    id_filiere: '',
    error_list: {},
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    

    // Récupérer la liste des filières
    axios.get(`http://127.0.0.1:8000/api/filieres`).then((res) => {
      if (res.data.status === 200) {
        setFiliereList(res.data.filieres);
      }
    });

    // Récupérer les données de l'étudiant
    axios.get(`http://127.0.0.1:8000/api/uniteEnseigns/${id}`).then((res) => {
      if (res.data.status === 200) {
        setUniteEnseignInput({
          nom_unite: res.data.unite.nom_unite,
          id_filiere: res.data.unite.id_filiere,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/uniteEnseigns');
      }
    });
  }, [id, navigate]);

  const updateEtudiant = (e) => {
    e.preventDefault();

    // Réinitialisez les messages d'erreur
    setUniteEnseignInput({
      ...UniteEnseignInput,
      error_list: {},
    });
    setFormError('');

    // Validation côté client
    const errors = {};
    if (UniteEnseignInput.nom_unite === '') {
      errors.nom_unite = 'Le nom_unite est requis';
    }
    if (UniteEnseignInput.id_filiere === '') {
      errors.id_filiere = 'La filière est requise';
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

      setUniteEnseignInput({
        ...UniteEnseignInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal('Erreurs', errorString, 'error');
    } else {
      // Pas d'erreurs, procéder à la requête Axios
      const data = {
        nom_unite: UniteEnseignInput.nom_unite,
        id_filiere: UniteEnseignInput.id_filiere,
      };
      axios.put(`http://127.0.0.1:8000/api/uniteEnseigns/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Succès', res.data.message, 'success');
            navigate('/admin/uniteEnseigns');
          } else if (res.data.status === 400) {
            setUniteEnseignInput({
              ...UniteEnseignInput,
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
    setUniteEnseignInput({ ...UniteEnseignInput, [e.target.name]: e.target.value });
  };
  console.log(UniteEnseignInput.id);
  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification de l'unité d'enseignement</h4>
                <NavLink to="/admin/uniteEnseigns" className="btn btn-primary btn-sm float-end">
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
                        <label htmlFor="nom_unite">nom_unite</label>
                        <input
                          type="text"
                          name="nom_unite"
                          className={`form-control ${UniteEnseignInput.error_list.nom_unite ? 'is-invalid' : ''}`}
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
                          className={`form-control ${UniteEnseignInput.error_list.id_filiere ? 'is-invalid' : ''}`}
                        >
                          <option value="">Sélectionner la filière</option>
                          {filiereList.map((filiere) => (
                            <option key={filiere.id_filiere} value={filiere.id_filiere} selected={filiere.nom_filiere === UniteEnseignInput.id_filiere}>
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
                        <NavLink to="/admin/uniteEnseigns" className="col">
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

export default EditUniteEnseign;

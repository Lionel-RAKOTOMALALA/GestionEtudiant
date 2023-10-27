import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditFiliere = () => {
  const navigate = useNavigate();
  const [filiereInput, setFiliereInput] = useState({
    nom_filiere: '',
    error_list: {},
  });
  const [formError, setFormError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/filieres/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setFiliereInput({
            nom_filiere: res.data.filiere.nom_filiere,
            error_list: {},
          });
        } else if (res.data.status === 404) {
          Swal.fire('Erreur', res.data.message, 'error');
          navigate('/admin/filieres');
        }
      });
  }, [id, navigate]);

  const updateFiliere = (e) => {
    e.preventDefault();
    setFormError('');
    setFiliereInput({
      ...filiereInput,
      error_list: {},
    });

    const data = {
      nom_filiere: filiereInput.nom_filiere,
    };

    axios.put(`http://127.0.0.1:8000/api/filieres/${id}`, data)
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire('Succès', res.data.message, 'success');
          navigate('/admin/filieres');
        } else if (res.data.status === 400) {
          setFiliereInput({
            ...filiereInput,
            error_list: res.data.errors,
          });
        } else if (res.data.status === 404) {
          Swal.fire('Erreur', res.data.message, 'error');
          navigate('/admin/filieres');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInput = (e) => {
    e.persist();
    setFiliereInput({ ...filiereInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification de la filière</h4>
                <NavLink to="/admin/filieres" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  <form onSubmit={updateFiliere}>
                    {formError && (
                      <div className="alert alert-danger mb-3">
                        {formError}
                      </div>
                    )}
                    <div className="form-group mb-3">
                      <label htmlFor="nom_filiere">Nom de la filière</label>
                      <input
                        type="text"
                        name="nom_filiere"
                        className={`form-control ${filiereInput.error_list.nom_filiere ? 'is-invalid' : ''}`}
                        onChange={handleInput}
                        value={filiereInput.nom_filiere}
                      />
                      {filiereInput.error_list.nom_filiere && (
                        <div className="text-danger">
                          {filiereInput.error_list.nom_filiere}
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
                      <NavLink to="/admin/filieres" className="col">
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

export default EditFiliere;

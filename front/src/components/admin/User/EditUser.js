import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { UilArrowCircleLeft, UilCheckCircle, UilTimes } from '@iconscout/react-unicons';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../../admin/materiels/loader';

const EditUser = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    name: '',
    email: '',
    role_user: '',
    error_list: {},
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/users/${id}`).then((res) => {
      if (res.data.status === 200) {
        setUserInput({
          name: res.data.user.name,
          email: res.data.user.email,
          role_user: res.data.user.role_user,
          error_list: {},
        });
        setIsLoading(false);
      } else if (res.data.status === 404) {
        setIsLoading(false);
        swal('Erreur', res.data.message, 'error');
        navigate('/admin/users');
      }
    });
  }, [id, navigate]);

  const updateUser = (e) => {
    e.preventDefault();
    setUserInput({
      ...userInput,
      error_list: {},
    });
    setFormError("");

    const errors = {};
    if (userInput.name === "") {
      errors.name = "Nom d'utilisateur est requis";
    }
    if (userInput.email === "") {
      errors.email = "E-mail est requis";
    }
    if (userInput.role_user === "") {
      errors.role_user = "Rôle est requis";
    }

    if (Object.keys(errors).length > 0) {
      let errorString;
      if (Object.keys(errors).length > 1) {
        const errorFields = Object.keys(errors).map((key) => {
          if (key === "name") {
            return "Nom d'utilisateur";
          } else if (key === "email") {
            return "E-mail";
          } else if (key === "role_user") {
            return "Rôle";
          }
          return key;
        }).join(" et ");
        errorString = `Les champs "${errorFields}" sont requis`;
      } else {
        const errorField = Object.keys(errors)[0];
        if (errorField === "name") {
          errorString = "Le champ 'Nom d'utilisateur' est requis";
        } else if (errorField === "email") {
          errorString = "Le champ 'E-mail' est requis";
        } else if (errorField === "role_user") {
          errorString = "Le champ 'Rôle' est requis";
        }
      }

      setUserInput({
        ...userInput,
        error_list: errors,
      });
      setFormError(errorString);
      swal("Erreurs", errorString, "error");
    } else {
      const data = {
        name: userInput.name,
        email: userInput.email,
        role_user: userInput.role_user,
      };
      axios.put(`http://127.0.0.1:8000/api/users/${id}`, data)
        .then((res) => {
          if (res.data.status === 200) {
            swal('Success', res.data.message, 'success');
            navigate('/admin/users');
          } else if (res.data.status === 400) {
            setUserInput({
              ...userInput,
              error_list: res.data.errors,
            });
          } else if (res.data.status === 404) {
            swal("Erreur", res.data.message, "error");
            navigate('/admin/users');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleInput = (e) => {
    e.persist();
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Modification de l'utilisateur</h4>
                <NavLink to="/admin/users" className="btn btn-primary btn-sm float-end">
                  <UilArrowCircleLeft /> Retour à l'affichage
                </NavLink>
              </div>
              <div className="container">
                <div className="card-body">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <form onSubmit={updateUser}>
                      {formError && (
                        <div className="alert alert-danger mb-3">
                          {formError}
                        </div>
                      )}
                      <div className="form-group mb-3">
                        <label htmlFor="name">Nom d'utilisateur</label>
                        <input
                          type="text"
                          name="name"
                          className={`form-control ${userInput.error_list.name ? 'is-invalid' : ''}`}
                          onChange={handleInput}
                          value={userInput.name}
                        />
                        {userInput.error_list.name && (
                          <div className="text-danger">
                            {userInput.error_list.name}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="email">E-mail</label>
                        <input
                          type="email"
                          name="email"
                          className={`form-control ${userInput.error_list.email ? 'is-invalid' : ''}`}
                          onChange={handleInput}
                          value={userInput.email}
                        />
                        {userInput.error_list.email && (
                          <div className="text-danger">
                            {userInput.error_list.email}
                          </div>
                        )}
                      <div className="form-group mb-3">
                        <label htmlFor="role_user">Rôle</label>
                        <input
                          type="text"
                          name="role_user"
                          className={`form-control ${userInput.error_list.role_user ? 'is-invalid' : ''}`}
                          onChange={handleInput}
                          value={userInput.role_user}
                        />
                        {userInput.error_list.role_user && (
                          <div className="text-danger">
                            {userInput.error_list.role_user}
                          </div>
                        )}
                      </div>
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
                        <NavLink to="/admin/users" className="col">
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

export default EditUser;

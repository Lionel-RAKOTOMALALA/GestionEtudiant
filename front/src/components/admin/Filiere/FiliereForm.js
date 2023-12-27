import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

function FiliereForm() {
  const navigate = useNavigate();
  const [filiereInput, setFiliere] = useState({
    nom_filiere: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setFiliere({ ...filiereInput, [e.target.name]: e.target.value });
  };

  const registerFiliere = (e) => {
    e.preventDefault();

    const data = {
      nom_filiere: filiereInput.nom_filiere,
    };

    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then(response => {
      axios.post('http://127.0.0.1:8000/api/filieres', data).then(res => {
        if (res.data.status === 200) {
          Swal.fire('Succès', res.data.message, 'success');
          navigate('/user/filieres');
        } else {
          setFiliere({ ...filiereInput, error_list: res.data.validation_errors });
        }
      });
    });
  }

  return (
    <div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Ajouter une filière</h4>
              </div>
              <div className="card-body">
                <form onSubmit={registerFiliere}>
                  <div className="form-group mb-3">
                    <label>Nom de la filière</label>
                    <input type="text" name="nom_filiere" onChange={handleInput} value={filiereInput.nom_filiere} className="form-control" />
                    <span>{filiereInput.error_list.nom_filiere}</span>
                  </div>
                  <div className="form-group mb-3">
                    <button type="submit" className="btn btn-primary">Ajouter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FiliereForm;

import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Navbar from '../auth/Layouts/Navbar';
import { useNavigate } from 'react-router';
import TopBar from '../../admin/TopBar';

function Register() {
    const navigate = useNavigate();
  const [registerInput, setRegister] = useState({
    username: '',
    email: '',
    password: '',
    role_user: '',
    logo: '', // Assurez-vous de gérer le téléchargement de fichiers côté serveur
    nom_entreprise: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
  };

  const registerSubmit = (e) => {
    e.preventDefault();

    const data = {
      username: registerInput.username,
      email: registerInput.email,
      password: registerInput.password,
      role_user: registerInput.role_user,
      logo: registerInput.logo, // Assurez-vous de gérer le téléchargement de fichiers côté serveur
      nom_entreprise: registerInput.nom_entreprise,
    };

    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then(response => {
      axios.post('http://127.0.0.1:8000/api/register', data).then(res => {
        if (res.data.status === 200) {
          localStorage.setItem('auth_token', res.data.token);
          localStorage.setItem('auth_name', res.data.username);
          swal('Success', res.data.message, 'success');
          navigate('/admin')
        } else {
          setRegister({ ...registerInput, error_list: res.data.validation_errors });
        }
      });
    });
  }

  return (
    <div>
      <TopBar />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4>Register</h4>
              </div>
              <div className="card-body">
                <form onSubmit={registerSubmit}>
                  <div className="form-group mb-3">
                    <label>Username</label>
                    <input type="text" name="username" onChange={handleInput} value={registerInput.username} className="form-control" />
                    <span>{registerInput.error_list.username}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input type="text" name="email" onChange={handleInput} value={registerInput.email} className="form-control" />
                    <span>{registerInput.error_list.email}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleInput} value={registerInput.password} className="form-control" />
                    <span>{registerInput.error_list.password}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Role User</label>
                    <input type="text" name="role_user" onChange={handleInput} value={registerInput.role_user} className="form-control" />
                    <span>{registerInput.error_list.role_user}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Logo</label>
                    <input type="file" name="logo" onChange={handleInput} className="form-control-file" />
                    <span>{registerInput.error_list.logo}</span>
                  </div>
                  <div className="form-group mb-3">
                    <label>Nom de l'Entreprise</label>
                    <input type="text" name="nom_entreprise" onChange={handleInput} value={registerInput.nom_entreprise} className="form-control" />
                    <span>{registerInput.error_list.nom_entreprise}</span>
                  </div>
                  <div className="form-group mb-3">
                    <button type="submit" className="btn btn-primary">Register</button>
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

export default Register;

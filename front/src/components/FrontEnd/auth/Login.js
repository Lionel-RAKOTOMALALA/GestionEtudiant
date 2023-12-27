  import React, { useState } from 'react';
  import axios from 'axios';
  import swal from 'sweetalert';
  import { useNavigate } from 'react-router-dom';
  import TopBar from '../../admin/TopBar';
  const Login = () => {

    localStorage.getItem('auth_token')
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'admin';
    const isUserSimple = userRole === 'userSimple';
  
    // Racine des liens en fonction du rôle
    const linkRoot = isAdmin ? '/admin' : isUserSimple ? '/user' : '';
    
    const navigate = useNavigate();
    const [loginInput, setLogin] = useState({
      name: '',
      password: '',
      error_list: [],

    });

    const handleInput = (e)=>{
      e.persist();
      setLogin({...loginInput, [e.target.name]: e.target.value});

    }

    const loginSubmit = (e)=>{
      e.preventDefault();
      
      const data ={
        name: loginInput.name,
        password: loginInput.password,
      }
      axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then(response => {
        axios.post(`http://127.0.0.1:8000/api/login`,data).then(res =>{
        if(res.data.status === 200){
          alert(res.data.token);
          const user = JSON.stringify(res.data.user);
          localStorage.setItem('user', user);
          console.log(localStorage.getItem('user'));
          localStorage.setItem('role', res.data.role);
          localStorage.setItem('auth_token', res.data.token);
          localStorage.setItem('professeur_count', res.data.professeur_count);
          swal('Success',res.data.message,"success");
          //  window.location.reload();
          if (res.data.role === 'admin') {
            navigate('/admin');
          } else if (res.data.role === 'userSimple') {
            navigate('/user');
          }
        }else if(res.data.status === 401)
        {
          swal('Avertissement',res.data.message,"warning");

        }else{
          setLogin({...loginInput, error_list : res.data.validation_errors});

        }
      })
    })
  }
    

    return (
      <div>
        <TopBar/>
        <div className='container py-5 mt-5'>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div className='card'>
                <div className='card-header'>
                  <h4>Authentification</h4>
                </div>
                <div className='card-body'>
                  <form onSubmit={loginSubmit}>
                    <div className='form-group mb-3'>
                      <label>Nom d'utilisateur</label>
                      <input type='text' name='name' onChange={handleInput} value={loginInput.name} className='form-control'/>
                      <span className='text-danger'>{loginInput.error_list.name}</span>
                    </div>
                    <div className='form-group mb-3'>
                      <label>Mot de passe</label>
                      <input type='password' name='password' onChange={handleInput} value={loginInput.password} className='form-control' />
                      <span className='text-danger'>{loginInput.error_list.password}</span>
                    </div>
                    
                    <div className='form-group mb-3'>
                      <button type='submit' className='btn btn-primary'>S'inscrire</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default Login
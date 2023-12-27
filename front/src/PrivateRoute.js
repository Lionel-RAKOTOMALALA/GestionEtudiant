import React, { useState, useEffect } from 'react';
import { Navigate,useNavigate } from 'react-router';
import swal from 'sweetalert';
import axios from 'axios';
import Loader from '../src/components/admin/materiels/loader'
import Dashboard from './components/admin/Dashboard';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie').then(() => {
      try {
            axios.get('http://127.0.0.1:8000/api/checkingAuthenticated', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            },
        })
          .then((res) => {
            if (res.data.status === 200 && localStorage.getItem('auth_token')) {
              setIsAuthenticated(true);
              console.log(res.data);
            } else {
              setIsAuthenticated(false);
              console.log(res.data);
            }
          })
          .catch((err) => {
            setIsAuthenticated(false);
            if (err.response && err.response.status === 401) {
              // Rediriger vers la page de connexion en cas d'erreur d'authentification
              // Vous devez également utiliser un composant de routage pour gérer la navigation
              localStorage.removeItem('auth_token');
              navigate("/login");
              // Afficher une alerte
              // swal('Unauthorized', err.response.data.message, 'warning');
            }
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    });
  }, []);
  axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    if (err.response.status === 401) {
      localStorage.clear();
      navigate("/login"); // Rediriger vers la page de connexion
      return Promise.reject(err);
    } else if (err.response.status === 403) {
      navigate("/403"); // Rediriger vers la page d'erreur 403
      return Promise.reject(err);
    } else if (err.response.status === 404) {
      navigate("/404"); // Rediriger vers la page d'erreur 403
      return Promise.reject(err);
    }
    return Promise.reject(err);
  });

  // axios.interceptors.response.use(function (response){
  //   return response;

  // }, function (error){
  //   if(error.response.status === 403)
  //   {
  //     swal("Forbedden","Url/page Not Found", "warning");
  //     Navigate('/')
  //   }
  //   return Promise.reject(error);
  // })
  if (isLoading) {
    return <div><Loader/></div>;
  }

  return isAuthenticated ? <Dashboard /> : <Navigate to="/login" />;
};

export default PrivateRoute;

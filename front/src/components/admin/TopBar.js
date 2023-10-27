import axios from 'axios';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import swal from 'sweetalert';

const TopBar = () => {
  const navigate = useNavigate();

  const logoutSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://127.0.0.1:8000/api/logout', null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      })
      .then((res) => {
        if (res.data.status === 200) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_name');
          swal('Success', res.data.message, 'success');
          // alert(localStorage.removeItem('auth_token'))
          navigate('/login');
          alert( localStorage.getItem('auth_token'));
          //  window.location.reload();
          
        } else {
          // Gérer d'autres cas si nécessaire
        }
      })
      .catch((error) => {
        // Gérer les erreurs de la demande de déconnexion ici
      });
  };

  let AuthButtons = null;
  if (localStorage.getItem('auth_token')) {
    // Afficher le menu authentifié
    AuthButtons = (
      <ul className="navbar-nav">
        {/* Nav Item - Alerts */}
        <li className="nav-item dropdown no-arrow mx-1">
          <NavLink className="nav-link dropdown-toggle" to="#" id="alertsDropdown" role="button"
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i className="fas fa-bell fa-fw"></i>
            {/* Counter - Alerts */}
            <span className="badge badge-danger badge-counter">3+</span>
          </NavLink>
          {/* Dropdown - Alerts */}
          <div className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="alertsDropdown">
            <h6 className="dropdown-header">
              Notifications
            </h6>
            <NavLink className="dropdown-item d-flex align-items-center bg-white text-secondary" to="#">
              <div className="mr-3">
                <div className="icon-circle bg-primary">
                  <i className="fas fa-file-alt text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 12, 2019</div>
                <span className="font-weight-bold">A new monthly report is ready to download!</span>
              </div>
            </NavLink>
            <NavLink className="dropdown-item d-flex align-items-center bg-white text-secondary" to="#">
              <div className="mr-3">
                <div className="icon-circle bg-success">
                  <i className="fas fa-donate text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 7, 2019</div>
                $290.29 has been deposited into your account!
              </div>
            </NavLink>
            <NavLink className="dropdown-item d-flex align-items-center bg-white text-secondary" to="#">
              <div className="mr-3">
                <div className="icon-circle bg-warning">
                  <i className="fas fa-exclamation-triangle text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 2, 2019</div>
                Spending Alert: We've noticed unusually high spending for your account.
              </div>
            </NavLink>
            <NavLink className="dropdown-item text-center small text-gray-500 bg-white text-secondary" to="#">Show All Alerts</NavLink>
          </div>
        </li>

        <li className="nav-item dropdown no-arrow">
          <NavLink className="nav-link dropdown-toggle" to="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">Lionel Ar'k</span>
            <img className="img-profile rounded-circle" src="../../img/undraw_profile.svg" />
          </NavLink>
          <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in bg-white" aria-labelledby="userDropdown">
            <NavLink className="dropdown-item bg-white text-secondary" to="#">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </NavLink>
            <NavLink className="dropdown-item bg-white text-secondary" to="#">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Paramètre
            </NavLink>
            <div className="dropdown-divider white-background"></div>
            <NavLink
              className="dropdown-item bg-white text-secondary"
              to="/"
              onClick={logoutSubmit}
            >
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Se déconnecter
            </NavLink>
          </div>
        </li>
      </ul>
    );
  } else {
    AuthButtons = (
      // Afficher le menu non authentifié
      <ul className="navbar-nav">
        <li className="nav-item">
          <NavLink className="nav-link text-secondary" to="/">
            Accueil
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-secondary" to="/register">
            S'inscrire
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-secondary" to="/login" tabIndex="-1" aria-disabled="true">
            
            Se connecter
          </NavLink>
        </li>
      </ul>
    );
  }

  const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

  const changeStyle1 = () => {
    if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled1");
    } else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    }
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3" onClick={changeStyle1}>
        <i className="fa fa-bars"></i>
      </button>
      <ul className="navbar-nav ml-auto">
        {AuthButtons}
      </ul>
    </nav>
  );
};

export default TopBar;

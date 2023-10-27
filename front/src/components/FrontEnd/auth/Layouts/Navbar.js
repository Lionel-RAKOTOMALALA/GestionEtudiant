import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow sticky-top mb-5">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Copefrito</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/">Acceuil</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">S'inscrire</NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink className="nav-link " to="/login" tabIndex="-1" aria-disabled="true">Se connecter</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
  )
}

export default Navbar
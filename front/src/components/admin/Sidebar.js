import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UilUserCircle, UilTicket } from '@iconscout/react-unicons';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  AppstoreAddOutlined,
  BookOutlined,
} from '@ant-design/icons';

function Sidebar() {
  const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
console.log(localStorage.getItem('professeur_count'));
  const changeStyle = () => {
    if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
    } else {
      setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
    }
  };

  const location = useLocation();
  const userRole = localStorage.getItem('role');
  
  const isAdmin = userRole === 'admin';
  const isUserSimple = userRole === 'userSimple';

  // Racine des liens en fonction du rôle
  const linkRoot = isAdmin ? '/admin' : isUserSimple ? '/user' : '';

  return (
    <ul className={style} id="accordionSidebar">
      {/* Sidebar - Brand */}
      <NavLink className="sidebar-brand d-flex align-items-center justify-content-center" to={location.pathname}>
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">UTM</div>
        <div className="text-center d-none d-md-inline">
          <button className="rounded-circle border-0" id="sidebarToggle" onClick={changeStyle}></button>
        </div>
      </NavLink>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

   
  
      <hr className="sidebar-divider" />

      {/* Listes des données */}
      {userRole === 'admin' && (
        <>
          <div className="sidebar-heading">Listes des données</div>
          <li className="nav-item">
            <div
              className="nav-link collapsed"
              data-toggle="collapse"
              data-target="#collapseMatériels"
              aria-expanded="true"
              aria-controls="collapseMatériels"
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-fw fa-cube"></i>
              <span>Etudiants</span>
            </div>
            <div id="collapseMatériels" className="collapse" aria-labelledby="headingMatériels" data-parent="#accordionSidebar">
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Listes des Etudiants</h6>
                <NavLink className="collapse-item" to="/admin/etudiants">
                  Tous
                </NavLink>
              </div>
            </div>
          </li>
        </>
      )}
      {/* Divider */}
      <hr className="sidebar-divider" />
  
      {/* Listes des données */}
      {userRole === 'admin' && (
        <>
          <div className="sidebar-heading">Listes des données</div>
          <li className="nav-item">
            {/* ... (existing code) */}
            <NavLink className="collapse-item" to={`${linkRoot}/etudiants`}>
              Tous
            </NavLink>
          </li>
        </>
      )}
  
      {/* Divider */}
      <hr className="sidebar-divider" />
  
      {/* Autres éléments */}
      {userRole === 'admin' && (
        <>
          <div className="sidebar-heading">Autres éléments</div>
          <li className="nav-item">
            <NavLink className="nav-link" to={`${linkRoot}/professeurs`}>
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Professeurs</span>
            </NavLink>
          </li>
          <li className="nav-item text-white">
            <NavLink className="nav-link" to={`${linkRoot}/filieres`}>
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span>Filiere</span>
            </NavLink>
          </li>
          <li className="nav-item text-white">
            <NavLink className="nav-link" to={`${linkRoot}/uniteEnseigns`}>
              <i className="fas fa-fw fa-tachometer-alt"></i>
              <span> Unité d'enseignement</span>
            </NavLink>
          </li>
        </>
      )}
  
      {userRole === 'userSimple' && (
        <>
          <div className="sidebar-heading">Listes des données</div>
          <li className="nav-item text-white">
            <NavLink className="nav-link" to={`${linkRoot}/cours`}>
              <i className="fas fa-fw fa-cube"></i>
              cours
            </NavLink>
          </li>
        </>
      )}
    </ul>
  );
      }
export default Sidebar;

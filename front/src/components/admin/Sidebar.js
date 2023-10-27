import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UilUserCircle,UilTicket  } from '@iconscout/react-unicons';

function Sidebar() {
    const [style, setStyle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");

    const changeStyle = () => {
        if (style === "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion") {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled");
        } else {
            setStyle("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion");
        }
    };
    const location = useLocation();

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

            {/* Nav Item - Dashboard */}
            <li className="nav-item">
                <NavLink className="nav-link text-white" to="/admin">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Tableau de bord</span>
                </NavLink>
            </li>

            {/* Divider */}
            <hr className="sidebar-divider" />

            {/* Listes des données */}
            <div className="sidebar-heading">Listes des données</div>

            {/* Matériels */}
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

            {/* Divider */}
            <hr className="sidebar-divider" />

            {/* Autres éléments */}
            <div className="sidebar-heading">Autres éléments</div>
            <li className="nav-item">
                <NavLink className="nav-link" to="/admin/professeurs">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Professeurs</span>
                </NavLink>
            </li>
            <li className="nav-item text-white">
                <NavLink className="nav-link" to="/admin/filieres">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Filiere</span>
                </NavLink>
            </li>
            <li className="nav-item text-white">
                <NavLink className="nav-link" to="/admin/users">
                    <i className="fas fa-fw fa-tachometer-alt"></i>
                    <span>Utilisateurs</span>
                </NavLink>
            </li>

           
            <li className="nav-item">
                <div
                    className="nav-link collapsed"
                    data-toggle="collapse"
                    data-target="#collapseTickets"
                    aria-expanded="true"
                    aria-controls="collapseTickets"
                    style={{ cursor: 'pointer' }}
                >
                    <i className="fas fa-fw fa-cube"></i>
                    <span>Cours</span>
                </div>
                <div id="collapseTickets" className="collapse" aria-labelledby="headingTickets" data-parent="#accordionSidebar">
                    <div className="bg-white py-2 collapse-inner rounded">
                        <h6 className="collapse-header">Listes des tickets </h6>
                        
                        <NavLink className="collapse-item" to="/admin/tickets/tous">
                            Tous
                        </NavLink>
                        <NavLink className="collapse-item" to="/admin/uniteEnseigns">
                            Unité d'enseignement
                        </NavLink>
                    </div>
                </div>
            </li>
        </ul>
    );
}

export default Sidebar;

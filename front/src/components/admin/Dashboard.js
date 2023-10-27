import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../admin/TopBar';
import Sidebar from '../admin/Sidebar';
import ScrollBtn from '../admin/ScrollBtn';
import LogoutModal from '../admin/LogoutModal';
import Footer from '../admin/Footer';

function Dashboard() {
    return (
        <div>
            <body id="page-top">
                <div id="wrapper">
                    <Sidebar />
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <TopBar />
                            <Outlet /> {/* Utilisez Outlet pour afficher le contenu de l'itinéraire actuel et de ses sous-itinéraires */}
                        </div>
                        <Footer />
                    </div>
                </div>
                <ScrollBtn />
                <LogoutModal />
            </body>
        </div>
    );
}

export default Dashboard;

import React from 'react';
import './App.css';
import Dashboard from './components/admin/Dashboard';
import Home from './components/FrontEnd/Home';
import Login from './components/FrontEnd/auth/Login';
import Register from './components/FrontEnd/auth/register';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import Content_dashboard from './components/admin/Content_dashboards';
import Content_profil from './components/admin/Content_profil';
import UserApp from './components/admin/User/UserApp';
import UserForm from './components/admin/User/UserForm';
import EditUser from './components/admin/User/EditUser';
import axios from 'axios';
import FiliereApp from './components/admin/Filiere/FiliereApp';
import FiliereForm from './components/admin/Filiere/FiliereForm';
import EditFiliere from './components/admin/Filiere/EditFiliere';
import EtudiantApp from './components/admin/Etudiant/EtudiantApp';
import EtudiantForm from './components/admin/Etudiant/EtudiantForm';
import EditEtudiant from './components/admin/Etudiant/EditEtudtiant';
import ProfesseurApp from './components/admin/Professeur/ProfesseurApp';
import ProfesseurForm from './components/admin/Professeur/ProfesseurForm';
import EditProfesseur from './components/admin/Professeur/EditProfesseur';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
function App() {
  // localStorage.clear();
  return (
    <Router>
      <Routes>
        <Route path="/" element={localStorage.getItem('auth_token')?<Navigate to='/admin'/> : <Home />} />
        <Route path="/register" element={localStorage.getItem('auth_token')?<Navigate to='/admin'/> : <Register />} />
        <Route path="/login" element={localStorage.getItem('auth_token')?<Navigate to='/admin'/> : <Login />} />
        <Route path="/admin" element={localStorage.getItem('auth_token')? <Navigate to='/admin'/> : <Navigate to='/login'/>}/>
        <Route path="/admin" element={<Dashboard />}>
          <Route index element={<Content_dashboard />} /> 
          <Route path="profile" element={<Content_profil />} />
          <Route path='/admin/users' element={<UserApp/>}/>
          <Route path='/admin/users/ajout' element={<UserForm/>}/>
          <Route path='/admin/users/edit/:id' element={<EditUser/>}/>
          <Route path='/admin/filieres' element={<FiliereApp/>}/>
          <Route path='/admin/filieres/ajout' element={<FiliereForm/>}/>
          <Route path='/admin/filieres/edit/:id' element={<EditFiliere/>}/>
          <Route path='/admin/etudiants' element={<EtudiantApp/>}/>
          <Route path='/admin/etudiants/ajout' element={<EtudiantForm/>}/>
          <Route path='/admin/etudiant/edit/:id' element={<EditEtudiant/>}/>
          <Route path='/admin/professeurs' element={<ProfesseurApp/>}/>
          <Route path='/admin/professeurs/ajout' element={<ProfesseurForm/>}/>
          <Route path='/admin/professeur/edit/:id' element={<EditProfesseur/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
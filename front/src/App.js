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
import UniteEnseignApp from './components/admin/UniteEnseign/UniteEnseignApp';
import UniteEnseignForm from './components/admin/UniteEnseign/UniteEnseignForm';
import EditUniteEnseign from './components/admin/UniteEnseign/EditUniteEnseign';
import CoursApp from './components/admin/Cours/CoursApp';
import CoursForm from './components/admin/Cours/CoursForm';
import EditCours from './components/admin/Cours/EditCours';
import Page403 from './403';
import Page404 from './404';
import PrivateRoute from './PrivateRoute';
import PrivateRouteUserSimple from './PrivateUserSimpleRoute';
import DetailCours from './components/admin/Cours/DetailCours';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.defaults.withCredentials = true;
function App() {
  // localStorage.clear();
  const userRole = localStorage.getItem('role');
  const isAdmin = userRole === 'admin';
  const isUserSimple = userRole === 'userSimple';

  // Racine des liens en fonction du rôle
  const linkRoot = isAdmin ? '/admin' : isUserSimple ? '/user' : '';
  return (
    <Router>
      <Routes>
      <Route path="/" element={ !!localStorage.getItem('auth_token') ? <Navigate to={linkRoot} /> : <Login />} /> 
        <Route path="/login" element={!!localStorage.getItem('auth_token') ? <Navigate to={linkRoot} /> : <Login/>} />
        <Route path="/admin" element={<PrivateRoute />}>
          <Route index element={<Content_dashboard />} /> 
          <Route path="profile" element={<Content_profil />} />
          <Route path='/admin/users' element={<UserApp/>}/>
          <Route path='/admin/users/ajout' element={<UserForm/>}/>
          <Route path='/admin/users/edit/:id' element={<EditUser/>}/>
          <Route path='/admin/etudiants' element={<EtudiantApp/>}/>
          <Route path='/admin/etudiants/ajout' element={<EtudiantForm/>}/>
          <Route path='/admin/etudiant/edit/:id' element={<EditEtudiant/>}/>
          <Route path='/admin/professeurs' element={<ProfesseurApp/>}/>
          <Route path='/admin/professeurs/ajout' element={<ProfesseurForm/>}/>
          <Route path='/admin/professeur/edit/:id' element={<EditProfesseur/>}/>
          
        </Route>

        <Route path="/user" element={<PrivateRouteUserSimple/>}>
          <Route index element={<Content_dashboard />} /> 
          <Route path="profile" element={<Content_profil />} />
          <Route path='/user/filieres' element={<FiliereApp/>}/>
          <Route path='/user/filieres/ajout' element={<FiliereForm/>}/>
          <Route path='/user/filieres/edit/:id' element={<EditFiliere/>}/>
          <Route path='/user/uniteEnseigns' element={<UniteEnseignApp/>}/>
          <Route path='/user/uniteEnseign/ajout' element={<UniteEnseignForm/>}/>
          <Route path='/user/uniteEnseign/edit/:id' element={<EditUniteEnseign/>}/>
          <Route path='/user/cours' element={<CoursApp/>}/>
          <Route path='/user/cours/ajout' element={<CoursForm/>}/>
          <Route path='/user/cours/edit/:id' element={<EditCours/>}/> 
          <Route path='/user/detail_cours/:code_matiere' element={<DetailCours/>}/>
        </Route>



        <Route path="403" element={<Page403 />} />
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;
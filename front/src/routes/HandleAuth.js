import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const AuthHandler = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
   
  
  useEffect(() => {
    const checkAuthentication = async () => {
      if (localStorage.getItem('auth_token')) {
        setIsLoading(false); // Authentifié
      } else {
        setIsLoading(false); // Non authentifié
      }
    };

    checkAuthentication();
  }, []);

  return isLoading ? <div>Loading...</div> : children;
};

export default AuthHandler;

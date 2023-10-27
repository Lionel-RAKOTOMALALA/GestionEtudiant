import React from 'react'
import {Outlet, Navigate} from 'react-router-dom'

const AdminPrivateRoute = () => {
  let auth = {'token': false}
  return (
    auth.token ? <Outlet/> : <Navigate to="/login"/>
  )
}

export default AdminPrivateRoute
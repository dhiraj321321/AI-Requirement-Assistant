import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token')
  return token ? children : <Navigate to='/' replace />
}

export default function App(){
  return (
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
    </Routes>
  )
}

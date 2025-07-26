import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Login, SignUp } from './pages/Login'


const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
     
    </Routes>
  );
}

export default App;

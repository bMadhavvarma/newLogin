import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Login, SignUp } from './pages/Login'

import Todo from './pages/Todo';


const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/signup" element={token ? <Navigate to="/home" /> : <SignUp />} />
      <Route path="/home" element={<Todo/>} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
     
    </Routes>
  );
}

export default App;

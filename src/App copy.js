import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './admin/login';
import Home from './components/home';
import SignUp from './admin/signup';

const App = () => {
  return (
      <Router>
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/signup" element={<SignUp />}/>
              <Route path="/" element={<Navigate replace to="/login" />} /> 
          </Routes>
      </Router>
  );
};

export default App;

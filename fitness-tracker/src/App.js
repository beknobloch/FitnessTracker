import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExampleQuery from './components/ExampleQuery';
import Start from './pages/Start';
import React from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
        <header className="App-header">
          <Router>
            <NavBar />
            <Routes>
              {/* Redirect from base URL to /home */}
              <Route path="/" element={<Navigate replace to="/home" />} />
              <Route path="/home" element={<Start />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signUp" element={<Signup />} />
            </Routes>
          </Router>
        </header>
    </div>
  );
}

export default App;

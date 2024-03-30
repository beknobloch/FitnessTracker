import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Start from './pages/Start';
import React from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home'

function App() {

  return (
    <div className="App">
        <header className="App-header">
          <Router>
            <NavBar />
            <Routes>
              {/* Redirect from base URL to /start */}
              <Route path="/" element={<Navigate replace to="/start" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/start" element={<Start />}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/login" element={<Login />}/>
            </Routes>
          </Router>
        </header>
    </div>
  );
}

export default App;

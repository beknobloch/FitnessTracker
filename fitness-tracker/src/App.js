import './App.css';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Start from './pages/Start';
import React from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import HomeCoach from './pages/HomeCoach';

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
              <Route path="/coach-home" element={<HomeCoach />} />
              <Route path="/start" element={<Start />}/>
              <Route path="/start/login" element={<Navigate replace to="/login" />}/>
              <Route path="/start/signup" element={<Navigate replace to="/signup" />}/>
              <Route path="/start/home" element={<Navigate replace to="/home" />}/>
              <Route path="/start/coach-home" element={<Navigate replace to="/coach-home" />}/>
              <Route path="/signup" element={<Signup/>}/>
              <Route path="/login" element={<Login />}/>
            </Routes>
          </Router>
        </header>
    </div>
  );
}

export default App;

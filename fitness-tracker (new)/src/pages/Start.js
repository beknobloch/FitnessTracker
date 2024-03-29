import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ExampleQuery from '../components/ExampleQuery';

function Start() {
  const navigate = useNavigate(); // Use useNavigate hook for navigation
  const [showExampleQuery, setShowExampleQuery] = useState(false); // State to control the visibility of ExampleQuery

  return (
    <div>
      <p>Welcome to our Fitness Tracker!</p>
      <button onClick={() => navigate('/login')}>Log in</button>
      <button onClick={() => navigate('/signup')}>Sign up</button>
      {/* Button to toggle the visibility of ExampleQuery */}
      <button onClick={() => setShowExampleQuery(!showExampleQuery)}>Toggle Example Query</button>
      {/* Conditionally render ExampleQuery based on showExampleQuery state */}
      {showExampleQuery && <ExampleQuery />}
      <button onClick={() => navigate('/home')}>Skip login</button>
    </div>
  );
}

export default Start;

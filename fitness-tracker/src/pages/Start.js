import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import ExampleQuery from '../components/ExampleQuery';
import AuthStatus from '../components/AuthStatus';

function Start() {
  const [showExampleQuery, setShowExampleQuery] = useState(false); // State to control the visibility of ExampleQuery
  
  return (
    <div className='startPage'>
      <h2>Welcome to our Fitness Tracker!</h2>
      <p>Choose one of the options below to get started:</p>
      <AuthStatus displayLogout={false}/>
      {/* Button to toggle the visibility of ExampleQuery */}
      {/*<button onClick={() => setShowExampleQuery(!showExampleQuery)}>Toggle Example Query</button>*/}
      {/* Conditionally render ExampleQuery based on showExampleQuery state */}
      {/*showExampleQuery && <ExampleQuery />*/}
      {/*<button onClick={() => navigate('/home')}>Skip login</button>*/}
    </div>
  );
}

export default Start;

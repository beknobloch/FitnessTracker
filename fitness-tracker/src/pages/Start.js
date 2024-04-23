import React from 'react';
import AuthStatus from '../components/AuthStatus';

function Start() {
  return (
    <div className='startPage'>
      <h2>Welcome to our Fitness Tracker!</h2>
      <p>Choose one of the options below to get started:</p>
      <AuthStatus displayLogout={false}/>
    </div>
  );
}

export default Start;

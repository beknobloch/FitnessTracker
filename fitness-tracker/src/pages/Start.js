import ExampleQuery from '../components/ExampleQuery';
import React from 'react';

function Start(props) {
  return (
    <div>
      <p>Welcome to our Fitness Tracker!</p>
      <button onClick={() => props.navigation.navigate('Login')}>Log in</button>
      <button onClick={() => props.navigation.navigate('Signup')}>Sign up</button>

      {/* Remove the ExampleQuery and button JSX tag below when real project starts */}
      <ExampleQuery />
      <button title='Skip login' onPress={() => props.navigation.navigate('Home')}/>
    </div>
  );
}

export default Start;
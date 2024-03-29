import ExampleQuery from '../components/ExampleQuery';
import React from 'react';

function Start(props) {
  return (
    <div>
      <p>Welcome to our Fitness Tracker!</p>

      {/* Remove the ExampleQuery and button JSX tag below when real project starts */}
      <ExampleQuery />
      <button onClick={() => props.navigation.navigate('Home')}>Skip login</button>
    </div>
  );
}

export default Start;
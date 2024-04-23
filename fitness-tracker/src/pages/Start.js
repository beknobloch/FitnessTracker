// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import ExampleQuery from '../components/ExampleQuery';
// import AuthStatus from '../components/AuthStatus';

// function Start() {
//   const [showExampleQuery, setShowExampleQuery] = useState(false); // State to control the visibility of ExampleQuery
  
//   return (
//     <div className='startPage'>
//       <h2>Welcome to our Fitness Tracker!</h2>
//       <p>Choose one of the options below to get started:</p>
//       <AuthStatus displayLogout={false}/>
//       {/* Button to toggle the visibility of ExampleQuery */}
//       {/*<button onClick={() => setShowExampleQuery(!showExampleQuery)}>Toggle Example Query</button>*/}
//       {/* Conditionally render ExampleQuery based on showExampleQuery state */}
//       {/*showExampleQuery && <ExampleQuery />*/}
//       {/*<button onClick={() => navigate('/home')}>Skip login</button>*/}
//     </div>
//   );
// }

// export default Start;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Grid, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { auth } from '../config/firebase';
import config from '../config/config';
import Query from "../components/Query";

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText('#F45D01'),
  backgroundColor: '#F45D01',
  '&:hover': {
    backgroundColor: '#DC4D01',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

function AuthStatus({ displayEmail }) {
  let navigate = useNavigate();

  const [user, setUser] = useState(auth?.currentUser?.email);
  const [isCoach, setIsCoach] = useState();
  const clientId = config.client_id;
  const clientSecret = config.client_secret;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      setIsCoach(await Query.getValue(auth?.currentUser?.uid, 'isCoach'));
    });

    return () => unsubscribe();
  }, []);

  const handleClick = (pageName) => {
    navigate(pageName);
  };

  return (
    <Grid container direction="column" alignItems="center" className="authButtonContainer">
       <StyledTypography variant="h2">Welcome to our Fitness Tracker!</StyledTypography>
       <StyledTypography variant="body1">Choose one of the options below to get started:</StyledTypography>
      {user ? (
        <>
          {displayEmail && <StyledTypography variant="body1">{auth?.currentUser?.email}</StyledTypography>}
          <ColorButton onClick={() => navigate('/settings')} sx={{ mb: 1 }}>
            View My Settings
          </ColorButton>
          {isCoach ? (
            <ColorButton onClick={() => handleClick('/coach')} sx={{ mb: 1 }}>
              Set My Fitbit goals
            </ColorButton>
          ) : (
            typeof isCoach === 'undefined' ? (
              <StyledTypography variant="body1">Loading...</StyledTypography>
            ) : (
              <ColorButton onClick={() => handleClick('/home')} sx={{ mb: 1 }}>
                Go check out your Fitbit data!
              </ColorButton>
            )
          )}
        </>
      ) : (
        <Container maxWidth="xs">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Button
                    onClick={() => navigate('/login')}
                    sx={{ backgroundColor: '#F45D01', '&:hover': { backgroundColor: '#F45D01', color: '#333' }, marginBottom: '10px' }}
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Log in
                </Button>
                <Button
                    onClick={() => navigate('/signup')}
                    sx={{ backgroundColor: '#F45D01', '&:hover': { backgroundColor: '#F45D01', color: '#333' }, marginBottom: '10px' }}
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Sign up
                </Button>
            </div>
        </Container>
      )}
    </Grid>
  );
}

export default AuthStatus;

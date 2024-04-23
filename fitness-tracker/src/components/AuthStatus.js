import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
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

function AuthStatus() {
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

  async function revokeAccessToken(accessToken) {
    return await fetch('https://api.fitbit.com/oauth2/revoke', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'token=' + accessToken
    });
  }

  return (
    <div className="authButtonContainer">
      {user ? (
        <>
          <p className={'paragraph'}>{auth?.currentUser?.email}</p>
          <ColorButton onClick={() => navigate('/settings')} sx={{ mr: 1, mb: 1 }}>
            Settings
          </ColorButton>
          {isCoach ? (
            <ColorButton onClick={() => handleClick('/coach')} sx={{ mr: 1, mb: 1 }}>
              Set Fitbit goals
            </ColorButton>
          ) : (
            typeof isCoach === 'undefined' ? (
              <p>Loading...</p>
            ) : (
              <ColorButton onClick={() => handleClick('/home')} sx={{ mr: 1, mb: 1 }}>
                Go check out your Fitbit data!
              </ColorButton>
            )
          )}
        </>
      ) : (
        <div>
          <ColorButton onClick={() => navigate('/login')} sx={{ mr: 1, mb: 1 }}>
            Log in
          </ColorButton>
          <ColorButton onClick={() => navigate('/signup')} sx={{ mr: 1, mb: 1 }}>
            Sign up
          </ColorButton>
        </div>
      )}
    </div>
  );
}

export default AuthStatus;

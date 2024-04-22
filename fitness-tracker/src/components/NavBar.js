import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AuthStatus from './AuthStatus';

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText('#F45D01'),
  backgroundColor: '#F45D01',
  '&:hover': {
    backgroundColor: '#DC4D01',
  },
}));

const NavBar = () => {
  return (
    <AppBar position="fixed" style={{ top: 0, backgroundColor: '#333' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <div>
          <ColorButton component={RouterLink} to="/start" sx={{ margin: 1 }}>
            Start
          </ColorButton>
          <ColorButton component={RouterLink} to="/home" sx={{ margin: 1 }}>
            Home
          </ColorButton>
        </div>
        <AuthStatus displayLogout={true} />
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;

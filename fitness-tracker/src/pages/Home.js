import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Button } from "@mui/material";
import { auth } from '../config/firebase';
import FitbitDataComponent from '../components/fitbit/FitbitDataComponent.js';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setLoggedIn(!!user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: 20, marginTop: 40 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Welcome to Your Dashboard
                </Typography>
                {loggedIn ? (
                    <FitbitDataComponent redirectTo="home" />
                ) : (
                    <div>
                        <Typography variant="body1" align="center" gutterBottom>
                            You are not logged in.
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ backgroundColor: '#F45D01', '&:hover': { backgroundColor: '#F45D01', color: '#333' } }} onClick={handleLogin} fullWidth>
                            Login
                        </Button>
                    </div>
                )}
            </Paper>
        </Container>
    );
}

export default Home;

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Button, Box, CircularProgress } from "@mui/material";
import Query from "../components/Query";

function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const logIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setEmail("");
            setPassword("");

            if (await Query.getValue(auth?.currentUser?.uid, 'isCoach', true)) {
                navigate('/coach');
            } else {
                navigate('/home');
            }

        } catch (error) {
            console.log(error);
            alert("Incorrect username or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            p={2} 
        >
            <Box
                p={4}
                borderRadius={4}
                boxShadow={3}
                bgcolor="#ffffffcc"
            >
                <Typography variant="h4" color="#333" gutterBottom align="center">Login Page</Typography>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={logIn}
                        disabled={loading}
                        sx={{ backgroundColor: '#F45D01', '&:hover': { backgroundColor: '#F45D01', color: '#333' } }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;

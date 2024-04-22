import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { Typography, TextField, Button, Box, CircularProgress, FormControlLabel, Checkbox } from "@mui/material";

function Signup() {
    const [birthday, setBirthday] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCoach, setIsCoach] = useState(false);
    const [heightFeet, setHeightFeet] = useState(0);
    const [heightInches, setHeightInches] = useState(0);
    const [weight, setWeight] = useState(0);

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const userCollectionRef = collection(db, "users");

    const createAccount = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await addUser();
            if (isCoach) {
                navigate('/coach');
            } else {
                navigate('/select-coach');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to create an account. Please check your inputs and try again.");
        }
    };

    const addUser = async () => {
        try {
            const totalHeightInches = heightFeet * 12 + heightInches;
            const docRef = await addDoc(userCollectionRef, {
                name: name,
                uid: auth.currentUser.uid,
                birthday: birthday,
                isCoach: isCoach,
                height: totalHeightInches,
                weight: weight,
                coachId: isCoach ? "" : null // Set coachId to null if user is not a coach
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error(error);
        }
    };

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
                p={2}
                borderRadius={4}
                boxShadow={3}
                bgcolor="#ffffffcc"
                width="fit-content"
                maxWidth="400px"
            >
                <Typography variant="h4" color="#333" gutterBottom align="center">Sign Up</Typography>
                <TextField
                    label="Date of Birth"
                    variant="outlined"
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
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
                <TextField
                    label="Weight (lbs)"
                    variant="outlined"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <Box
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        variant="body1"
                        style={{
                            fontSize: "14px",
                            marginRight: "5px",
                            color: "#333",
                            marginBottom: "5px", 
                        }}
                    >
                        Height:
                    </Typography>
                    <div>
                        <select
                            value={heightFeet}
                            onChange={(e) => setHeightFeet(parseInt(e.target.value))}
                            style={{ marginBottom: "5px" }} 
                        >
                            {Array.from({ length: 8 }, (_, i) => i).map((value) => (
                                <option key={value} value={value}>
                                    {value} ft
                                </option>
                            ))}
                        </select>
                        <select
                            value={heightInches}
                            onChange={(e) => setHeightInches(parseInt(e.target.value))}
                        >
                            {Array.from({ length: 13 }, (_, i) => i).map((value) => (
                                <option key={value} value={value}>
                                    {value} in
                                </option>
                            ))}
                        </select>
                    </div>
                </Box>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isCoach}
                            onChange={(e) => setIsCoach(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Are you a health coach?"
                    style={{ marginBottom: "10px", color: "#333" }}
            
                />
                <br></br>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={createAccount}
                    sx={{ backgroundColor: '#F45D01', marginTop: "10px" }}
                >
                    Create Account
                </Button>
                {errorMessage && <Typography variant="body1" style={{ color: 'red', marginTop: "10px" }}>{errorMessage}</Typography>}
            </Box>
        </Box>
    );
}

export default Signup;

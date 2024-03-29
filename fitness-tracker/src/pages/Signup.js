import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from '../config/firebase';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const userCollectionRef = collection(db, "users");

    const createAccount = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await addUser();
            // Navigate to home page after successful signup
            navigate('/home');
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to create an account. Please check your inputs and try again.");
        }
    };

    const addUser = async () => {
        try {
            await addDoc(userCollectionRef, {
                name: name, 
                uid: auth.currentUser.uid, 
                birthday: birthday, // No need to format here, you can handle formatting when displaying if needed
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <input 
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <div>
                <p>Date of birth:</p>
                <input 
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                />
            </div>
            <input 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={createAccount}>Create Account</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default Signup;

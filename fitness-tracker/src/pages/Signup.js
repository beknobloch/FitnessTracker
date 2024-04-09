
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore"; 

function Signup() {
    const [birthday, setBirthday] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCoach, setIsCoach] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const userCollectionRef = collection(db, "users");

    const createAccount = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await addUser(user.uid); 
            // Redirect based on the isCoach flag
            navigate(isCoach ? '/coach-home' : '/home');
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to create an account. Please check your inputs and try again.");
        }
    };

    const addUser = async (uid) => { // Pass UID as a parameter
        try {
            // Set the UID as the document ID in Firestore
            const docRef = doc(userCollectionRef, uid); // Use UID as the document ID
            await setDoc(docRef, { // Assuming you have imported setDoc from firestore
                name: name, 
                birthday: birthday,
                isCoach: isCoach,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <label htmlFor="birthday" style={{ fontSize: "14px" }}>Date of birth:  </label>
            <input 
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
            />
            <br />
            <input 
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input 
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <label htmlFor="isCoach">Sign up as a coach:</label>
            <input
                id="isCoach"
                type="checkbox"
                checked={isCoach}
                onChange={(e) => setIsCoach(e.target.checked)}
            />
            <br />
            <button onClick={createAccount}>Create Account</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default Signup;

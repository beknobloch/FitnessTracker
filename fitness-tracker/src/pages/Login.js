
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";


function Login(props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const logIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Access Firestore
            const db = getFirestore();
            const userDoc = doc(db, "users", user.uid);
            const userSnapshot = await getDoc(userDoc);
            
            // Check if isCoach is true or false
            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                if (userData.isCoach) {
                    navigate('/coach-home');
                } else {
                    navigate('/home');
                }
            } else {
                throw new Error("User data not found");
            }
        } catch (error) {
            console.log(error);
            alert("Incorrect username or password");
        } 
    }
    

    return(
        <div>
            <h1>Login</h1>
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
            <button onClick={logIn}>Log in</button>
        </div>
    )
}

export default Login;
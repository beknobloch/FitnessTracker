
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore"; 

function Signup() {
    const [birthday, setBirthday] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isCoach, setIsCoach] = useState(false)

    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const userCollectionRef = collection(db, "users");

    const createAccount = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await addUser();
            if(isCoach){
                navigate('/coach')
            }else{
                navigate('/home')
            }
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
                birthday: birthday,
                isCoach: isCoach
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
            
            <label htmlFor="isCoach" style={{ fontSize: "14px" }}>Are you a health coach?  </label>
            <input 
                type="checkbox"
                id='isCoach'
                value={isCoach}
                onChange={(e) => setIsCoach(!isCoach)}
            />
            <br />
            <button onClick={createAccount}>Create Account</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
}

export default Signup;

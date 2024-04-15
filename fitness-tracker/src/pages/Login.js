
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigate } from "react-router-dom";
import Query from "../components/Query";

function Login(props){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setEmail("");
            setPassword("");

            if(await Query.getValue(auth?.currentUser?.uid, 'isCoach', true)){
                navigate('/coach')
            }else{
                navigate('/home')
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
            <button className={'button'} onClick={logIn}>Log in</button>
        </div>
    )
}

export default Login;
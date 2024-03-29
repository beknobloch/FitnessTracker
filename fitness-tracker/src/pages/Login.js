import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase'
import { useNavigate } from "react-router-dom";


function Login(props){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    //async function that signs in user
    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
            setEmail("")
            setPassword("")

            /*This resets the entire stack and brings the user inside the app
            This prevents being able to go back to the login or start page after being logged in
            */

            /*
            props.navigation.popToTop();
            props.navigation.replace('Home')*/

            navigate('/home');
            
        } catch (error) {
            console.log(error)
            alert("Incorrect username or password")
        } 
    }
    return(
        <div>
            <input 
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={logIn}>Log in</button>
        </div>
    )
}
export default Login;
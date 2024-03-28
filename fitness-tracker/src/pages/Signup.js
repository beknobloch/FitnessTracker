import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

function Signup(props){
    // variables
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [birthday, setBirthday] = useState(new Date())

    // database collection
    const userCollectionRef = collection(db, "users")

    //async function that creates an account for the user
    const createAccount = async () => {
        try {
            //after account is created, the user is automatically signed in
            await createUserWithEmailAndPassword(auth, email, password)
            addUser()
            alert("Account created! Redirecting to home page...", undefined, [
                {
                    text: "Let's get started!",
                    onPress: () => {
                        //this code runs after closing the alert box 
                        props.navigation.popToTop();
                        props.navigation.replace('Home');
                    }
                }
            ]);
            
            //resets variables
            setEmail("")
            setPassword("")
            setBirthday("00/00/0000")
            setName("")
        } catch (error) {
            console.log(error)
            alert("Incorrect username or password")
        } 
    }

    //adds user's name, birthday, and id (created by firebase authenticator) to database
    const addUser = async () => {
        try {
            // adds info to database
            await addDoc(userCollectionRef, {
                name: name, 
                uid: auth?.currentUser?.uid, // since the user is already logged in at this point, we can get their id
                birthday: birthday.toLocaleDateString('en-US', { // converts date to MM/DD/YYYY format 
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
            })
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <div>
                <input 
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                />
                <div>
                    <p>Date of birth: </p>
                    {/* Insert date picker  */}
                </div>

                <input 
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input 
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={createAccount}>Create Account</button>
        </div>
    )
}
export default Signup;
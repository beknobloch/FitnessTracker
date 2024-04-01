import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'

//if the user is not logged in, displays log in and sign up buttons. If logged in, displays something like "signed in as x"
function AuthStatus({ displayLogout }){
    let navigate = useNavigate(); 

    const [user, setUser] = useState(auth?.currentUser?.email)

    //listens for if user signs in/out
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);
    //navigates to page
    const handleClick = (pageName) =>{
        navigate(pageName)
    }

    //async function that signs out user
    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error)
        } 
    }
    return(

        <div className="authButtonContainer">
                {user ? (
                    <>
                        <p className={'paragraph'}>Logged in as {auth?.currentUser?.email}</p>
                        {displayLogout ? (
                            <button className={'button'} onClick={logout}>Log out</button>
                        ) : (
                            <button className={'button'} onClick={() => handleClick('home')}>Go check out your Fitbit
                                data!</button>
                        )}
                    </>

                ) : (
                    <div>
                        <button className={'button'} onClick={() => handleClick('login')}>Log in</button>
                        <button className={'button'} onClick={() => handleClick('signup')}>Sign up</button>
                    </div>
                )}
            
        </div>
    )
}
export default AuthStatus
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../config/firebase'
import { signOut } from 'firebase/auth'
import config from '../config/config';
import Query from "../components/Query";

//if the user is not logged in, displays log in and sign up buttons. If logged in, displays something like "signed in as x"
function AuthStatus({ displayLogout }){
    let navigate = useNavigate(); 

    const [user, setUser] = useState(auth?.currentUser?.email)
    const [isCoach, setIsCoach] = useState()
    const clientId = config.client_id;
    const clientSecret = config.client_secret;

    //listens for if user signs in/out
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            setIsCoach(await Query.getValue(auth?.currentUser?.uid, 'isCoach'))
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
            //await revokeAccessToken(sessionStorage.getItem('token')) // UNCOMMENT BEFORE DEPLOYING!
            handleClick('/start')
            sessionStorage.clear()
        } catch (error) {
            console.log(error)
        } 
    }
    
    // signs out of fitbit account
    async function revokeAccessToken(accessToken) {
        return await fetch('https://api.fitbit.com/oauth2/revoke', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'token=' + accessToken
        });
    }
    
    return(

        <div className="authButtonContainer">
                {user ? (
                    <>
                        <p className={'paragraph'}>{auth?.currentUser?.email}</p>
                        {displayLogout ? (
                            <button className={'button-logout'} onClick={logout}>Log out</button>
                        ) : (
                            <>
                                {isCoach ? (
                                    <button className={'button'} onClick={() => handleClick('/coach')}>Go set some Fitbit goals! </button>
                                ):(
                                    <>
                                        {typeof isCoach === 'undefined' ? (
                                            <p>Loading...</p>
                                        ):(
                                            <button className={'button'} onClick={() => handleClick('/home')}>Go check out your Fitbit data! </button>
                                        )}
                                    </>
                                    
                                )}
                            </>
                            
                        )}
                    </>

                ) : (
                    <div>
                        <button className={'button'} onClick={() => handleClick('/login')}>Log in</button>
                        <button className={'button'} onClick={() => handleClick('/signup')}>Sign up</button>
                    </div>
                )}
            
        </div>
    )
}
export default AuthStatus
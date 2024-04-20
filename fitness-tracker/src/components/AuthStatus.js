import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../config/firebase';
import config from '../config/config';
import Query from "../components/Query";

function AuthStatus() {
    let navigate = useNavigate();

    const [user, setUser] = useState(auth?.currentUser?.email);
    const [isCoach, setIsCoach] = useState();
    const clientId = config.client_id;
    const clientSecret = config.client_secret;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setUser(user);
            setIsCoach(await Query.getValue(auth?.currentUser?.uid, 'isCoach'));
        });

        return () => unsubscribe();
    }, []);

    const handleClick = (pageName) => {
        navigate(pageName);
    };

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

    return (
        <div className="authButtonContainer">
            {user ? (
                <>
                    <p className={'paragraph'}>{auth?.currentUser?.email}</p>
                    <button className={'button'} onClick={() => navigate('/settings')}>Settings</button>
                    {isCoach ? (
                        <button className={'button'} onClick={() => handleClick('/coach')}>Go set some Fitbit goals!</button>
                    ) : (
                        typeof isCoach === 'undefined' ? (
                            <p>Loading...</p>
                        ) : (
                            <button className={'button'} onClick={() => handleClick('/home')}>Go check out your Fitbit data!</button>
                        )
                    )}
                </>
            ) : (
                <div>
                    <button className={'button'} onClick={() => navigate('/login')}>Log in</button>
                    <button className={'button'} onClick={() => navigate('/signup')}>Sign up</button>
                </div>
            )}
        </div>
    );
}

export default AuthStatus;

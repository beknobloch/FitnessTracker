import React from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";



function SignOut({ loggedIn }){
    const clientId = '23RRWK';
    const clientSecret = 'd7830394ff0e361521dba4551e48b594';
    const navigate = useNavigate();

    //async function that signs out user
    const logout = async () => {
        try {
            console.log('start')
            await revokeAccessToken('eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1JSV0siLCJzdWIiOiJCWlRCWEciLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyc29jIHJlY2cgcnNldCByb3h5IHJudXQgcnBybyByc2xlIHJjZiByYWN0IHJyZXMgcmxvYyByd2VpIHJociBydGVtIiwiZXhwIjoxNzEyOTE2MzMxLCJpYXQiOjE3MTI4ODc1MzF9'
                ) .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                });
            console.log('end')
            await signOut(auth)
            navigate('/home');  // Redirect to home page after successful sign out
            
        } catch (error) {
            console.log(error)
        } 
    }
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
        <button onClick={logout} disabled={!loggedIn} style={!loggedIn ? {backgroundColor: 'gray'} : {}}>
        Sign out
    </button>
    )
}
export default SignOut
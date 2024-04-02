import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function SignOut({ loggedIn }){
    //async function that signs out user
    const logout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error)
        } 
    }

    return(
        <button disabled={!loggedIn} onClick={logout} disabledStyle={{backgroundColor: 'gray'}}>Sign out</button>
    )
}
export default SignOut